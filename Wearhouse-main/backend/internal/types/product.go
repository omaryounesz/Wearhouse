package types

import "mime/multipart"

type CreateProductRequest struct {
	Title       string                  `form:"title" json:"title" validate:"required,min=3,max=255"`
	Description string                  `form:"description" json:"description" validate:"required,min=10"`
	Category    string                  `form:"category" json:"category" validate:"required"`
	Size        string                  `form:"size" json:"size" validate:"required"`
	Brand       string                  `form:"brand" json:"brand" validate:"required"`
	Condition   string                  `form:"condition" json:"condition" validate:"required,oneof=new like_new good fair poor"`
	Price       float64                 `form:"price" json:"price" validate:"required,gt=0"`
	Images      []*multipart.FileHeader `form:"images" json:"images" validate:"omitempty,max=5"`
}

type UpdateProductRequest struct {
	Title       *string                 `form:"title" validate:"omitempty,min=3,max=255"`
	Description *string                 `form:"description" validate:"omitempty,min=10"`
	Category    *string                 `form:"category"`
	Size        *string                 `form:"size"`
	Brand       *string                 `form:"brand"`
	Condition   *string                 `form:"condition" validate:"omitempty,oneof=new like_new good fair poor"`
	Price       *float64                `form:"price" validate:"omitempty,gt=0"`
	Images      []*multipart.FileHeader `form:"images" validate:"omitempty,max=5"`
}

type ProductResponse struct {
	ID          string   `json:"id"`
	UserID      string   `json:"user_id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Category    string   `json:"category"`
	Size        string   `json:"size"`
	Brand       string   `json:"brand"`
	Condition   string   `json:"condition"`
	Price       float64  `json:"price"`
	IsAvailable bool     `json:"is_available"`
	Images      []string `json:"images"`
	CreatedAt   string   `json:"created_at"`
	UpdatedAt   string   `json:"updated_at"`
}

type ProductListResponse struct {
	Products []ProductResponse `json:"products"`
	Total    int64             `json:"total"`
	Page     int               `json:"page"`
	PerPage  int               `json:"per_page"`
}

type ProductFilters struct {
	Category    string   `query:"category"`
	Size        string   `query:"size"`
	Brand       string   `query:"brand"`
	Condition   string   `query:"condition"`
	MinPrice    *float64 `query:"min_price"`
	MaxPrice    *float64 `query:"max_price"`
	Search      string   `query:"search"`
	SortBy      string   `query:"sort_by"`
	SortOrder   string   `query:"sort_order"`
	Page        int      `query:"page"`
	PerPage     int      `query:"per_page"`
	IsAvailable *bool    `query:"is_available"`
}
