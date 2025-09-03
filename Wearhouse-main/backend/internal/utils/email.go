package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/smtp"
	"regexp"
	"wearhouse/configs"
)

// CarletonEmailPattern is the regex pattern for Carleton University email addresses
var CarletonEmailPattern = regexp.MustCompile(`^[a-zA-Z]+@cmail\.carleton\.ca$`)

// ValidateCarletonEmail checks if the email matches Carleton University format
func ValidateCarletonEmail(email string) bool {
	return CarletonEmailPattern.MatchString(email)
}

// GenerateVerificationToken generates a random token for email verification
func GenerateVerificationToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// SendVerificationEmail sends a verification email to the user
func SendVerificationEmail(to, token string, config *configs.Config) error {
	// Email server configuration
	auth := smtp.PlainAuth("", config.SMTP.Username, config.SMTP.Password, config.SMTP.Host)

	verificationLink := fmt.Sprintf("%s/verify-email?token=%s", config.AppURL, token)

	subject := "Verify your WearHouse account"
	body := fmt.Sprintf(`
Hello!

Thank you for registering with WearHouse. Please click the link below to verify your email address:

%s

This link will expire in 24 hours.

Best regards,
The WearHouse Team
`, verificationLink)

	msg := fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/plain; charset=UTF-8\r\n"+
		"\r\n"+
		"%s", to, subject, body)

	return smtp.SendMail(
		fmt.Sprintf("%s:%d", config.SMTP.Host, config.SMTP.Port),
		auth,
		config.SMTP.Username,
		[]string{to},
		[]byte(msg),
	)
}
