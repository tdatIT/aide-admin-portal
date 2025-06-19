# Hướng dẫn Setup SSL cho AIDE Admin Dashboard

## Tổng quan
Dự án này sử dụng `nginx-proxy` và `letsencrypt-nginx-proxy-companion` để tự động tạo và quản lý SSL certificates cho domain của bạn.

## Các file đã tạo
- `docker-compose.prod.yml` - Cấu hình Docker Compose cho production với SSL
- `setup-ssl.sh` - Script tự động setup
- `SSL-SETUP.md` - File hướng dẫn này

## Bước 1: Chuẩn bị
1. Đảm bảo Docker và Docker Compose đã được cài đặt
2. Domain của bạn phải trỏ về IP của server
3. Port 80 và 443 phải được mở trên firewall

## Bước 2: Cấu hình
1. Chạy script setup:
   ```bash
   chmod +x setup-ssl.sh
   ./setup-ssl.sh
   ```

2. Chỉnh sửa file `docker-compose.prod.yml`:
   - Thay `your-domain.com` bằng domain thực của bạn
   - Thay `your-email@example.com` bằng email của bạn

## Bước 3: Deploy
```bash
# Khởi động các services
docker-compose -f docker-compose.prod.yml up -d

# Xem logs
docker-compose -f docker-compose.prod.yml logs -f

# Kiểm tra trạng thái
docker-compose -f docker-compose.prod.yml ps
```

## Bước 4: Kiểm tra
1. Truy cập `https://your-domain.com` để kiểm tra SSL
2. Kiểm tra certificate trong browser
3. Xem logs nếu có lỗi

## Các lệnh hữu ích

### Dừng services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Restart services
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Xem logs của service cụ thể
```bash
docker-compose -f docker-compose.prod.yml logs -f aide-admin-dashboard
```

### Kiểm tra certificates
```bash
docker exec nginx-proxy ls -la /etc/nginx/certs/
```

## Troubleshooting

### SSL không hoạt động
1. Kiểm tra domain có trỏ đúng IP không
2. Kiểm tra port 80 và 443 có mở không
3. Xem logs của letsencrypt service

### Certificate không được tạo
1. Kiểm tra email trong cấu hình
2. Đảm bảo domain có thể truy cập được từ internet
3. Chờ vài phút để Let's Encrypt xử lý

### Ứng dụng không load
1. Kiểm tra logs của aide-admin-dashboard service
2. Đảm bảo build thành công
3. Kiểm tra nginx-proxy logs

## Lưu ý quan trọng
- Let's Encrypt có rate limits, không restart quá nhiều lần
- Certificates sẽ tự động renew
- Backup volumes nếu cần thiết
- Monitor logs thường xuyên trong lần đầu setup 