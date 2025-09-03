# WearHouse

WearHouse is a web application that allows university students to buy, sell, and trade second-hand clothing exclusively within their university community. The platform promotes sustainable fashion, reduces waste, and provides students with an affordable way to refresh their wardrobes.
Currently a work in progress but can be viewed here: https://wearhouse-brown.vercel.app/

## Features

- University-exclusive access with email verification
- Buy, sell, and trade second-hand clothing
- User profiles and ratings
- Secure transactions
- Community-driven marketplace

## Tech Stack

### Backend
- Go with Fiber framework
- PostgreSQL with GORM
- JWT authentication
- Docker for containerization

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Go 1.22+ (for backend development)

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wearhouse.git
cd wearhouse
```

2. Start the backend services:
```bash
docker-compose up
```

3. Start the frontend development server:
```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

## Project Structure

```
wearhouse/
├── backend/                 # Go backend
│   ├── cmd/                # Application entrypoints
│   ├── configs/            # Configuration
│   ├── internal/          # Internal packages
│   └── pkg/               # Public packages
│
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/         # Next.js pages
│   │   ├── components/  # React components
│   │   └── lib/        # Utilities
│   └── public/         # Static assets
│
└── docker-compose.yml    # Docker composition
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
