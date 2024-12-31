import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  statistics: any; // Thống kê tổng quan
  monthlyStatistics: string = ''; // Thống kê theo tháng (chuỗi trả về từ API)
  selectedMonth: number = new Date().getMonth() + 1; // Mặc định tháng hiện tại
  selectedYear: number = new Date().getFullYear(); // Mặc định năm hiện tại
  borrowStatusChart: any = null; // Biểu đồ tròn
  allMonthlyStatistics: { [month: number]: string } = {}; // Lưu dữ liệu của từng tháng



  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadMonthlyStatistics();
    this.loadAllMonthlyStatistics();

  }



  loadMonthlyStatistics(): void {
    this.http
      .get(`/api/admin/statistics-monthly?month=${this.selectedMonth}&year=${this.selectedYear}`, { responseType: 'text' })
      .subscribe((data: string) => {
        this.monthlyStatistics = data;
      }, error => {
        console.error('Error fetching monthly statistics:', error);
      });
  }

  onMonthYearChange(): void {
    this.loadMonthlyStatistics();
  }

  ngAfterViewInit(): void {
    // Đợi DOM sẵn sàng trước khi tạo biểu đồ
    if (this.statistics) {
      this.createBorrowStatusChart();
    }
  }

  loadStatistics(): void {
    this.http.get('/api/admin/dashboard-statistics')
      .subscribe((data: any) => {
        this.statistics = data;
        this.createBorrowStatusChart(); // Tạo biểu đồ khi đã có dữ liệu
      }, error => {
        console.error('Error fetching statistics:', error);
      });
  }

  createBorrowStatusChart(): void {
    const ctx = document.getElementById('borrowStatusChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    // Hủy biểu đồ cũ nếu đã tồn tại
    if (this.borrowStatusChart) {
      this.borrowStatusChart.destroy();
    }

    // Tạo biểu đồ tròn
    this.borrowStatusChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Trả đúng hạn', 'Trả quá hạn', 'Chưa trả'],
        datasets: [{
          data: [
            this.statistics?.returnedOnTime || 0,
            this.statistics?.returnedLate || 0,
            this.statistics?.notReturned || 0
          ],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
          hoverBackgroundColor: ['#218838', '#e0a800', '#c82333']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }

  loadAllMonthlyStatistics(): void {
    for (let month = 1; month <= 12; month++) {
      this.http
        .get(`/api/admin/statistics-monthly?month=${month}&year=${this.selectedYear}`, { responseType: 'text' })
        .subscribe(
          (data: string) => {
            this.allMonthlyStatistics[month] = data;
          },
          (error) => {
            console.error(`Error fetching data for month ${month}:`, error);
            this.allMonthlyStatistics[month] = 'Không có dữ liệu';
          }
        );
    }
  }

  onYearChange(): void {
    this.allMonthlyStatistics = {}; // Reset dữ liệu cũ
    this.loadAllMonthlyStatistics();
  }

}
