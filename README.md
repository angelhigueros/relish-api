# Relish API

A high-performance REST API built with Fastify that provides enriched photo data by aggregating information from multiple external sources. Designed for mobile applications that require optimized network usage and comprehensive data in single API calls.

## About the Project

Relish API serves as a data aggregation layer that combines information from multiple external APIs to provide enriched photo data. Instead of making multiple API calls from mobile applications (which can be inefficient on slow networks), this API fetches and combines data from:

- **Users API**: User information including addresses and company details
- **Albums API**: Album metadata and ownership information  
- **Photos API**: Photo details and media URLs

The API then enriches photo data with complete album and user information, providing a comprehensive dataset in a single request. This approach significantly reduces network overhead and improves mobile application performance.

## Technologies & Tools

### Core Framework
- **Fastify 4.x** - High-performance web framework for Node.js
- **Node.js 18+** - JavaScript runtime environment

### API Documentation
- **Swagger/OpenAPI 3.0** - Interactive API documentation
- **Swagger UI** - Web-based documentation interface

### Security & Performance
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling protection
- **Pino** - High-performance logging

### Development Tools
- **Jest** - Testing framework with comprehensive coverage
- **ESLint** - Code quality and style enforcement
- **Nodemon** - Development server with hot reload
- **Axios** - HTTP client for external API calls

### Project Structure
```
relish-api/
├── src/
│   ├── config/          # Application configuration
│   ├── controllers/     # Request handlers
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   ├── plugins/        # Fastify plugins
│   ├── __tests__/      # Test suites
│   └── server.js       # Application entry point
├── .eslintrc.js        # ESLint configuration
├── jest.config.js      # Jest configuration
├── nodemon.json        # Development server config
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/angelhigueros/relish-api
   cd relish-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   HOST=0.0.0.0
   NODE_ENV=development
   API_PREFIX=/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## Usage

### API Endpoints

#### Health Check
Verify the API status and get basic information:
```bash
GET /api/v1/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456,
    "environment": "development",
    "version": "1.0.0"
  }
}
```

#### Get Single Photo
Retrieve a specific photo with enriched album and user information:
```bash
GET /api/v1/photos/{id}
```

**Example:**
```bash
curl http://localhost:3000/api/v1/photos/1
```

**Response:**
```json
{
  "success": true,
  "message": "Photo data retrieved successfully",
  "data": {
    "id": 1,
    "title": "accusamus beatae ad facilis cum similique qui sunt",
    "url": "https://via.placeholder.com/600/92c952",
    "thumbnailUrl": "https://via.placeholder.com/150/92c952",
    "album": {
      "id": 1,
      "title": "quidem molestiae enim",
      "user": {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "address": {
          "street": "Kulas Light",
          "suite": "Apt. 556",
          "city": "Gwenborough",
          "zipcode": "92998-3874",
          "geo": {
            "lat": "-37.3159",
            "lng": "81.1496"
          }
        },
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "company": {
          "name": "Romaguera-Crona",
          "catchPhrase": "Multi-layered client-server neural-net",
          "bs": "harness real-time e-markets"
        }
      }
    }
  }
}
```

#### Get All Photos
Retrieve all photos with pagination (default: 25 items per page):
```bash
GET /api/v1/photos
```

**Example:**
```bash
curl http://localhost:3000/api/v1/photos
```

#### Filter Photos
Apply various filters to narrow down results:

**Filter by photo title (contains):**
```bash
GET /api/v1/photos?title=repudiandae
```

**Filter by album title (contains):**
```bash
GET /api/v1/photos?album.title=quidem
```

**Filter by user email (exact match):**
```bash
GET /api/v1/photos?album.user.email=Sincere@april.biz
```

**Combine multiple filters:**
```bash
GET /api/v1/photos?album.title=quidem&title=repudiandae
```

#### Pagination
Control the number of results and starting position:

**Limit results (default: 25):**
```bash
GET /api/v1/photos?limit=10
```

**Set offset (default: 0):**
```bash
GET /api/v1/photos?offset=50
```

**Combine pagination with filters:**
```bash
GET /api/v1/photos?album.title=quidem&limit=10&offset=50
```

**Response with pagination:**
```json
{
  "success": true,
  "message": "Found 100 photos matching the specified filters",
  "data": {
    "photos": [
      // Array of enriched photo objects
    ],
    "pagination": {
      "total": 100,
      "limit": 10,
      "offset": 50,
      "hasNext": true,
      "hasPrevious": true
    }
  }
}
```

### Advanced Examples

**Get first 5 photos from albums containing "quidem":**
```bash
curl "http://localhost:3000/api/v1/photos?album.title=quidem&limit=5&offset=0"
```

**Get photos with "repudiandae" in title, from user with specific email:**
```bash
curl "http://localhost:3000/api/v1/photos?title=repudiandae&album.user.email=Sincere@april.biz&limit=20"
```

**Get all photos from a specific user (paginated):**
```bash
curl "http://localhost:3000/api/v1/photos?album.user.email=Sincere@april.biz&limit=50&offset=100"
```

## API Documentation

API documentation is available at:
- **Swagger UI**: `http://localhost:3000/documentation`
- **OpenAPI JSON**: `http://localhost:3000/documentation/json`

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with hot reload |
| `npm test` | Run test suite |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix code quality issues automatically |

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `0.0.0.0` |
| `NODE_ENV` | Environment | `development` |
| `API_PREFIX` | API route prefix | `/api/v1` |

### Testing

Run the complete test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Error Handling

The API provides comprehensive error responses:

```json
{
  "success": false,
  "message": "Photo not found",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Resource not found
- `500` - Internal server error

## Deployment

### Automated Deployment with GitHub Actions

<img width="976" height="397" alt="image" src="https://github.com/user-attachments/assets/3d105504-96ea-43dc-b253-f22f9aef7dda" />


The project includes GitHub Actions workflows for automated testing and deployment:

#### Railway Deployment
- **Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: Push to `main` or `master` branch
- **Process**: 
  1. Run tests on Node.js 18.x and 20.x
      2. Execute linting checks
    3. Deploy to Railway if tests pass

<img width="324" height="180" alt="image" src="https://github.com/user-attachments/assets/b4686451-f236-4736-bb82-49013a9c0bb2" />

