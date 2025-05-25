# TradePro Deployment Guide

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- PostgreSQL 15+ (if running without Docker)
- Redis 7+ (if running without Docker)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd TradePro
```

### 2. Environment Configuration
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp mobile-app/.env.example mobile-app/.env
cp websocket-service/.env.example websocket-service/.env

# Update the .env files with your configuration
```

### 3. Start with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Database Setup
```bash
# Run migrations
docker-compose exec backend npm run migrate

# Seed database with sample data
docker-compose exec backend npm run seed
```

### 5. Mobile App Development
```bash
cd mobile-app

# Install dependencies
npm install

# iOS
npm run ios

# Android
npm run android
```

## 🏗️ Manual Setup (Without Docker)

### 1. Database Setup
```bash
# Install PostgreSQL and create database
createdb tradepro_dev

# Install Redis
# On macOS: brew install redis
# On Ubuntu: sudo apt-get install redis-server
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

### 3. WebSocket Service
```bash
cd websocket-service
npm install
npm run dev
```

### 4. Mobile App
```bash
cd mobile-app
npm install

# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## 🌐 Production Deployment

### AWS Deployment

#### 1. Infrastructure Setup
```bash
# Create RDS PostgreSQL instance
# Create ElastiCache Redis cluster
# Create ECS cluster for containers
# Setup Application Load Balancer
# Configure Route 53 for domain
```

#### 2. Environment Variables
```bash
# Production environment variables
NODE_ENV=production
DB_HOST=your-rds-endpoint
REDIS_URL=your-elasticache-endpoint
JWT_SECRET=your-production-jwt-secret
```

#### 3. Container Deployment
```bash
# Build and push Docker images
docker build -t tradepro-backend ./backend
docker build -t tradepro-websocket ./websocket-service

# Tag and push to ECR
docker tag tradepro-backend:latest your-account.dkr.ecr.region.amazonaws.com/tradepro-backend:latest
docker push your-account.dkr.ecr.region.amazonaws.com/tradepro-backend:latest
```

### Mobile App Deployment

#### iOS App Store
```bash
cd mobile-app

# Build for release
npx react-native run-ios --configuration Release

# Archive and upload to App Store Connect
```

#### Google Play Store
```bash
cd mobile-app

# Generate signed APK
cd android
./gradlew assembleRelease

# Upload to Google Play Console
```

## 🔧 Configuration

### Database Configuration
```javascript
// knexfile.js
module.exports = {
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    }
  }
};
```

### Nginx Configuration
```nginx
# nginx/nginx.conf
upstream backend {
    server backend:3000;
}

upstream websocket {
    server websocket:3001;
}

server {
    listen 80;
    server_name api.tradepro.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name ws.tradepro.com;

    location / {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## 📊 Monitoring and Logging

### Application Monitoring
```bash
# Install monitoring tools
npm install --save @sentry/node
npm install --save newrelic
```

### Log Management
```bash
# Centralized logging with ELK stack
docker-compose -f docker-compose.monitoring.yml up -d
```

### Health Checks
```bash
# Backend health check
curl http://localhost:3000/health

# WebSocket health check
curl http://localhost:3001/health
```

## 🔒 Security Considerations

### SSL/TLS Configuration
```bash
# Generate SSL certificates
certbot --nginx -d api.tradepro.com -d ws.tradepro.com
```

### Environment Security
```bash
# Use AWS Secrets Manager or similar
# Rotate JWT secrets regularly
# Enable database encryption
# Use VPC for network isolation
```

### API Security
```bash
# Rate limiting implemented
# CORS configured
# Helmet.js for security headers
# Input validation with Joi
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
npm run test:coverage
```

### Mobile App Testing
```bash
cd mobile-app
npm test
npm run test:e2e
```

### Load Testing
```bash
# Use Artillery or similar tools
artillery run load-test.yml
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose up --scale backend=3

# Use load balancer for distribution
# Implement Redis clustering
# Use read replicas for database
```

### Performance Optimization
```bash
# Enable Redis caching
# Implement CDN for static assets
# Use database indexing
# Optimize WebSocket connections
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS
        run: |
          # Build and deploy steps
```

## 📱 Mobile App Updates

### Over-the-Air Updates
```bash
# Use CodePush for React Native
npm install --save react-native-code-push

# Deploy updates
code-push release-react TradePro-iOS ios
code-push release-react TradePro-Android android
```

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection Issues**
   - Check connection strings
   - Verify network connectivity
   - Check firewall settings

2. **WebSocket Connection Problems**
   - Verify CORS settings
   - Check authentication tokens
   - Monitor connection logs

3. **Mobile App Build Issues**
   - Clear Metro cache: `npx react-native start --reset-cache`
   - Clean builds: `cd ios && xcodebuild clean`
   - Update dependencies: `npm update`

### Debug Commands
```bash
# View container logs
docker-compose logs -f backend

# Connect to database
docker-compose exec postgres psql -U tradepro -d tradepro_dev

# Redis CLI
docker-compose exec redis redis-cli
```

## 📞 Support

For deployment issues or questions:
- Check the logs first
- Review environment configuration
- Consult the troubleshooting section
- Contact the development team

---

**Note**: This deployment guide assumes a production-ready setup. Adjust configurations based on your specific requirements and infrastructure.