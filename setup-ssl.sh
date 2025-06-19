#!/bin/bash

# Script để setup SSL cho AIDE Admin Dashboard
# Sử dụng nginx-proxy và Let's Encrypt

echo "🚀 Setting up SSL for AIDE Admin Dashboard..."

# Kiểm tra xem Docker có đang chạy không
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Tạo external network nếu chưa tồn tại
if ! docker network ls | grep -q "proxy"; then
    echo "📡 Creating proxy network..."
    docker network create proxy
fi

# Kiểm tra xem có file .env không
if [ ! -f ".env.production" ]; then
    echo "📝 Creating .env.production file..."
    cat > .env.production << EOF
# Production environment variables
NODE_ENV=production
# Thêm các biến môi trường khác nếu cần
EOF
fi

echo "✅ Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit docker-compose.prod.yml and replace:"
echo "   - your-domain.com with your actual domain"
echo "   - your-email@example.com with your email"
echo ""
echo "2. Make sure your domain points to this server's IP address"
echo ""
echo "3. Run the following command to start the services:"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "4. Check logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f" 