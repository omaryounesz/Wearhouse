package handlers

import (
	"fmt"
	"time"
	"wearhouse/configs"
	"wearhouse/internal/database"
	"wearhouse/internal/models"
	"wearhouse/internal/types"
	"wearhouse/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type AuthHandler struct {
	config *configs.Config
}

func NewAuthHandler(config *configs.Config) *AuthHandler {
	return &AuthHandler{
		config: config,
	}
}

// Register handles user registration
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req types.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Invalid request body",
		})
	}

	// Validate Carleton University email
	if !utils.ValidateCarletonEmail(req.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Must use a valid Carleton University email address",
		})
	}

	// Check if user already exists
	var existingUser models.User
	result := database.DB.Where("email = ?", req.Email).First(&existingUser)
	if result.RowsAffected > 0 {
		return c.Status(fiber.StatusConflict).JSON(types.ErrorResponse{
			Error: "Email already registered",
		})
	}

	// Generate verification token
	verificationToken, err := utils.GenerateVerificationToken()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.ErrorResponse{
			Error: "Error generating verification token",
		})
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.ErrorResponse{
			Error: "Error processing registration",
		})
	}

	// Create user
	user := models.User{
		ID:                uuid.New(),
		Email:             req.Email,
		Password:          hashedPassword,
		FirstName:         req.FirstName,
		LastName:          req.LastName,
		University:        "Carleton University",
		IsVerified:        false,
		VerificationToken: verificationToken,
		TokenExpiresAt:    time.Now().Add(24 * time.Hour),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.ErrorResponse{
			Error: "Error creating user",
		})
	}

	// Log the verification token for testing purposes (remove in production)
	fmt.Printf("\n[TEST ONLY] Email: %s, Verification Token: %s\n", user.Email, verificationToken)

	// Send verification email
	if err := utils.SendVerificationEmail(user.Email, verificationToken, h.config); err != nil {
		// Log the error but don't return it to the user
		// The user is created but email sending failed
		// We might want to implement a retry mechanism or manual verification in this case
		return c.Status(fiber.StatusCreated).JSON(types.RegisterResponse{
			Message: "Registration successful. Please check your email to verify your account.",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(types.RegisterResponse{
		Message: "Registration successful. Please check your email to verify your account.",
	})
}

// VerifyEmail handles email verification
func (h *AuthHandler) VerifyEmail(c *fiber.Ctx) error {
	token := c.Query("token")
	if token == "" {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Verification token is required",
		})
	}

	var user models.User
	result := database.DB.Where("verification_token = ?", token).First(&user)
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(types.ErrorResponse{
			Error: "Invalid verification token",
		})
	}

	if time.Now().After(user.TokenExpiresAt) {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Verification token has expired",
		})
	}

	// Update user verification status
	user.IsVerified = true
	user.VerificationToken = "" // Clear the token after verification
	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.ErrorResponse{
			Error: "Error updating user verification status",
		})
	}

	return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
		Message: "Email verified successfully",
	})
}

// Login handles user login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req types.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Invalid request body",
		})
	}

	// Find user
	var user models.User
	result := database.DB.Where("email = ?", req.Email).First(&user)
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(types.ErrorResponse{
			Error: "Invalid credentials",
		})
	}

	// Check if email is verified
	if !user.IsVerified {
		return c.Status(fiber.StatusUnauthorized).JSON(types.ErrorResponse{
			Error: "Please verify your email before logging in",
		})
	}

	// Check password
	if !utils.CheckPassword(user.Password, req.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(types.ErrorResponse{
			Error: "Invalid credentials",
		})
	}

	// Generate token
	token, err := utils.GenerateToken(user.ID, user.Email, h.config)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.ErrorResponse{
			Error: "Error generating token",
		})
	}

	return c.Status(fiber.StatusOK).JSON(types.AuthResponse{
		Token: token,
	})
}

// VerifyWithToken handles email verification via POST request with token in body
func (h *AuthHandler) VerifyWithToken(c *fiber.Ctx) error {
	var req struct {
		Token string `json:"token"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Invalid request body",
		})
	}

	if req.Token == "" {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Verification token is required",
		})
	}

	var user models.User
	result := database.DB.Where("verification_token = ?", req.Token).First(&user)
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(types.ErrorResponse{
			Error: "Invalid verification token",
		})
	}

	if time.Now().After(user.TokenExpiresAt) {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Verification token has expired",
		})
	}

	// Update user verification status
	user.IsVerified = true
	user.VerificationToken = "" // Clear the token after verification
	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.ErrorResponse{
			Error: "Error updating user verification status",
		})
	}

	return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
		Message: "Email verified successfully",
	})
}

// ResendVerification resends the verification email
func (h *AuthHandler) ResendVerification(c *fiber.Ctx) error {
	var req struct {
		Email string `json:"email"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Invalid request body",
		})
	}

	if req.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Email is required",
		})
	}

	// Validate Carleton University email
	if !utils.ValidateCarletonEmail(req.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Must use a valid Carleton University email address",
		})
	}

	// Find user
	var user models.User
	result := database.DB.Where("email = ?", req.Email).First(&user)
	if result.RowsAffected == 0 {
		// Don't reveal that the email doesn't exist
		return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
			Message: "If your email exists in our system, a verification email has been sent",
		})
	}

	// Check if already verified
	if user.IsVerified {
		return c.Status(fiber.StatusBadRequest).JSON(types.ErrorResponse{
			Error: "Email is already verified",
		})
	}

	// Generate new verification token
	verificationToken, err := utils.GenerateVerificationToken()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.ErrorResponse{
			Error: "Error generating verification token",
		})
	}

	// Update user with new token
	user.VerificationToken = verificationToken
	user.TokenExpiresAt = time.Now().Add(24 * time.Hour)
	if err := database.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.ErrorResponse{
			Error: "Error updating verification token",
		})
	}

	// Log the verification token for testing purposes (remove in production)
	fmt.Printf("\n[TEST ONLY] Email: %s, New Verification Token: %s\n", user.Email, verificationToken)

	// Send verification email
	if err := utils.SendVerificationEmail(user.Email, verificationToken, h.config); err != nil {
		// Log the error but don't return it to the user
		return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
			Message: "If your email exists in our system, a verification email has been sent",
		})
	}

	return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
		Message: "Verification email has been sent",
	})
}
