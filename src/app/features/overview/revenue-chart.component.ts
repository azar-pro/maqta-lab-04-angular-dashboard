import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  template: `<div class="chart-wrap"><canvas #canvas role="img" aria-label="Revenue trend from April to September"></canvas></div>`
})
export class RevenueChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  private themeObserver?: MutationObserver;

  ngAfterViewInit(): void {
    this.createChart();
    this.themeObserver = new MutationObserver(() => this.applyTheme());
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  private css(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  private createChart(): void {
    const accent = this.css('--accent') || '#9a4a2f';
    const muted = this.css('--muted') || '#6e716c';
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          data: [42, 48, 51, 61, 69, 84],
          borderColor: accent,
          backgroundColor: 'rgba(154,74,47,.08)',
          fill: true,
          tension: .35,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: muted } },
          y: {
            border: { display: false },
            grid: { color: 'rgba(127,127,127,.12)' },
            ticks: { color: muted, callback: value => `$${value}k` }
          }
        }
      }
    });
  }

  private applyTheme(): void {
    if (!this.chart) return;
    const accent = this.css('--accent') || '#9a4a2f';
    const muted = this.css('--muted') || '#6e716c';
    const dataset = this.chart.data.datasets[0];
    dataset.borderColor = accent;
    if (this.chart.options.scales?.['x']?.ticks) this.chart.options.scales['x'].ticks.color = muted;
    if (this.chart.options.scales?.['y']?.ticks) this.chart.options.scales['y'].ticks.color = muted;
    this.chart.update('none');
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    this.chart?.destroy();
  }
}
