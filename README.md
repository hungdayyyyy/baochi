# Forbes Việt Nam - Hệ Thống Báo Chí & Tạp Chí Số

Hệ thống cổng thông tin báo chí số Forbes Việt Nam được xây dựng trên nền tảng **Next.js 14 App Router**, **MongoDB 7.0**, và **MinIO S3 Object Storage**, đóng gói sẵn sàng triển khai bằng **Docker & Docker Compose**.

---

## 🚀 Hướng Dẫn Triển Khai Nhanh

### 1. Đẩy mã nguồn lên GitLab mới của bạn
Thư mục `.git` đã được gỡ bỏ hoàn toàn sạch sẽ. Bạn chỉ cần chạy các lệnh sau:

```bash
git init
git add .
git commit -m "feat: complete Forbes Vietnam production release"
git branch -M main
git remote add origin <URL_GITLAB_CUA_BAN>
git push -u origin main
```

---

### 2. Triển khai bằng Docker Compose trên Server

Trên máy chủ Linux hoặc môi trường server của bạn, clone repo về và chạy:

```bash
# 1. Khởi động toàn bộ cụm dịch vụ (Next.js App + MongoDB + MinIO S3 + Caddy + Auto-create Bucket)
docker compose up -d --build

# 2. Chạy Seed dữ liệu toàn bộ 66 bài báo, danh mục, bố cục trang chủ và tài khoản Admin vào MongoDB
docker compose exec app npm run seed
```

---

### 3. Thông Tin Dịch Vụ & Tài Khoản Mặc Định

| Dịch vụ | Địa chỉ truy cập | Tài khoản / Ghi chú |
| :--- | :--- | :--- |
| **Trang chủ Web** | `http://<IP_SERVER>` hoặc `http://localhost` | Giao diện đầy đủ chuyên mục, tabs & bài viết |
| **Trang Quản trị Admin** | `http://<IP_SERVER>/admin` | **Email**: `admin@forbes.vn`<br>**Mật khẩu**: `Admin@123456` |
| **MinIO S3 Console** | `http://<IP_SERVER>:9001` | **User**: `minioadmin`<br>**Password**: `minioadmin123`<br>Bucket: `forbes-media` |
| **MongoDB** | Nội bộ cổng `27017` trong mạng Docker | Database: `forbes_vn`<br>User: `forbes_app` |

---

### 4. Cấu trúc Dự án Sau Khi Dọn Dẹp

```
├── docker/                 # Cấu hình Caddyfile & mongo-init.js
├── docker-compose.yml      # Cụm Docker hoàn chỉnh (App, Mongo, MinIO, Caddy)
├── Dockerfile              # Dockerfile đa tầng tối ưu Next.js Standalone
├── public/                 # Assets tĩnh (logo, fonts, icons)
├── scripts/
│   ├── seed.ts             # Script seed toàn bộ bài báo & layouts vào MongoDB
│   ├── seed-data.json      # Bộ dữ liệu 66 bài báo chuẩn Forbes
│   ├── backup.sh           # Sao lưu cơ sở dữ liệu MongoDB
│   └── restore.sh          # Phục hồi cơ sở dữ liệu MongoDB
├── src/
│   ├── app/                # App Router (Trang chủ, Chi tiết bài, Admin, API)
│   ├── components/         # Components giao diện công khai & quản trị
│   ├── lib/
│   │   ├── cache.ts        # Tầng truy vấn MongoDB tối ưu có caching ISR
│   │   ├── auth.ts         # Xác thực NextAuth kết nối trực tiếp User MongoDB
│   │   ├── storage/        # Bộ điều khiển lưu trữ MinIO S3
│   │   └── db/             # Kết nối Mongoose & Mongoose Models
└── package.json
```

---

### 5. Lệnh Quản Trị Hữu Ích

```bash
# Xem log ứng dụng
docker compose logs -f app

# Backup database
./scripts/backup.sh

# Restore database
./scripts/restore.sh <backup_folder>
```
