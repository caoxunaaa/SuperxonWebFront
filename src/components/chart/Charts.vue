<template>
  <div class="x-bar">
    <div :id="id"  :option="option" style="height:800px;"></div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
highchartsMore(HighCharts)
export default {
  // 验证类型
  props: {
    id: {
      type: String
    },
    option: {
      type: Object
    }
  },
  watch: {
    option () {
      HighCharts.chart(this.id, this.option)
    }
  },
  mounted () {
    HighCharts.chart(this.id, this.option)
    HighCharts.setOptions({
      lang: {
        printChart: '打印图表',
        downloadJPEG: '下载 JPEG 文件',
        downloadPDF: '下载 PDF   文件',
        downloadPNG: '下载 PNG  文件',
        downloadSVG: '下载 SVG  文件',
        downloadCSV: '下载 CSV  文件',
        downloadXLS: '下载 XLS   文件',
        viewData: '查看数据表格'},
      colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
      chart: {
        backgroundColor: {
          linearGradient: [0, 0, 500, 500],
          stops: [
            [0, 'rgb(84, 92, 100)'],
            [1, 'rgb(84, 92, 100)']
          ]
        }
      },
      xAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
          style: {
            color: '#A0A0A3'
          }
        }
      },
      yAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
          style: {
            color: '#A0A0A3'
          }
        }
      },
      title: {
        style: {
          color: '#000',
          font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
      },
      subtitle: {
        style: {
          color: '#666666',
          font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
        }
      },
      legend: {
        itemStyle: {
          font: '9pt Trebuchet MS, Verdana, sans-serif',
          color: 'black'
        },
        itemHoverStyle: {
          color: 'white'
        }
      }
    })
    HighCharts.chart(this.id, this.option)
  }
}
</script>
