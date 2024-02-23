## cai dat mongo va check time connect

1- cau hinh mongo va check xem co instance connect mongo
2- Cách kiểm tra bao nhiêu connect trong hệ thống code
3-  Kiểm tra hệ thống quá tải connect
4- Có nên disConnect() liên tục ? => ko can dong lien tuc theo cach thu cong nhung co mot so case can dong
5-  PoolSize là gì? Và ưu điểm ? => VBằng cách đặt maxPoolSize, bạn có thể kiểm soát tổng số lượng kết nối được tạo trong pool. Điều này giúp quản lý tài nguyên và đảm bảo rằng cơ sở dữ liệu không bị quá tải do quá nhiều kết nối.
6- Nếu Users vượt quá số lượng PoolSize thì sao ? => Ví dụ, nếu bạn đặt maxPoolSize thành 100, pool kết nối sẽ giữ tối đa 100 kết nối đến cơ sở dữ liệu tại bất kỳ thời điểm nào. Nếu ứng dụng cố gắng mượn một kết nối khi pool đã đạt đến giới hạn này, nó sẽ chờ đợi cho đến khi một kết nối trở lại pool trước khi tiếp tục.