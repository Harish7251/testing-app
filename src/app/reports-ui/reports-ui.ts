import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
@Component({
  selector: 'app-reports-ui',
  standalone: false,
  templateUrl: './reports-ui.html',
  styleUrl: './reports-ui.css',
})
export class ReportsUI {
  // Bar Chart Data
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 400, grid: { color: '#f0f0f0' } },
      x: { grid: { display: false } }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['01: Agri', '02: Animal', '03: Co-op', '04: Defence', '05: Edu', '06: Elec'],
    datasets: [
      { data: [261, 108, 56, 35, 361, 23], backgroundColor: '#48bb78', borderRadius: 4 }
    ]
  };

  // Doughnut Chart Data
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, padding: 20 } }
    }
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Approved (95.68%)', 'In Process (0.33%)', 'To Be Created (6.20%)'],
    datasets: [{
      data: [864, 3, 56],
      backgroundColor: ['#48bb78', '#4299e1', '#f6ad55'],
      hoverOffset: 4
    }]
  };

  // Table Data
  public reportData = [
    { id: 1, demand: 'Agriculture', count: 261, inProcess: 1, approved: 250, toBeCreated: 10 },
    { id: 2, demand: 'Animal Husbandry', count: 108, inProcess: 0, approved: 102, toBeCreated: 6 },
    { id: 3, demand: 'Co-operation', count: 56, inProcess: 0, approved: 54, toBeCreated: 2 },
    { id: 4, demand: 'Defence Services', count: 35, inProcess: 0, approved: 35, toBeCreated: 0 },
    { id: 5, demand: 'Education', count: 361, inProcess: 2, approved: 345, toBeCreated: 16 },
    { id: 6, demand: 'Election', count: 23, inProcess: 0, approved: 22, toBeCreated: 1 },
    { id: 7, demand: 'Energy & Power', count: 59, inProcess: 0, approved: 56, toBeCreated: 3 },
  ];
}