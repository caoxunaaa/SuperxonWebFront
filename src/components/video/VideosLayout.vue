<template>
 <div class="file">
    <div class="grid">
      <div style="float:left"><img src="../../assets/logo.png" alt="" style="width: 100px;height:45px"></div>
        <el-button class="files" type="primary" plain @click="dialogVisible = true">上传文件</el-button>
    </div>
    <el-table
    :data="video_urls"
    style="width: 100%">
    <el-table-column
      label="上传日期"
      width="300">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.UploadTime }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="文件名"
      width="350">
      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
          <el-tag type="success" size="medium"
          v-if="((scope.row.StorePath.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')==='.mp4'">
          {{ scope.row.Name }}</el-tag>
          <el-tag type="warning" size="medium"
          v-if="((scope.row.StorePath.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')==='.rar'">
          {{ scope.row.Name }}</el-tag>
          <el-tag type="warning" size="medium"
          v-if="((scope.row.StorePath.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')==='.zip'">
          {{ scope.row.Name }}</el-tag>
        </div>
      </template>
    </el-table-column>

    <el-table-column
      label="上传人"
      width="200"
      align="center">
      <template slot-scope="scope">
        <div slot="reference" class="name-wrapper">
          <el-tag  size="medium">{{ scope.row.Uploader }}</el-tag>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center" width="400">
      <template slot-scope="scope">
        <el-button
          size="mini"
          class="el-icon-video-play"
          type="primary" plain
          v-if="((scope.row.StorePath.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')==='.mp4'"
          @click="handleRun(scope.$index, scope.row)">
        </el-button>
        <el-button
          size="mini"
          type="danger"
          class="el-icon-delete"
          v-if="((scope.row.StorePath.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')==='.mp4'"
          @click="handleDelete(scope.$index, scope.row)">
        </el-button>
        <el-button
          size="mini"
          type="primary" plain
          class="el-icon-download"
          v-if="((scope.row.StorePath.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')==='.rar'"
          @click="handleDownload(scope.$index, scope.row)">
        </el-button>
        <el-button
          size="mini"
          type="danger"
          class="el-icon-delete"
          v-if="((scope.row.StorePath.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')==='.rar'"
          @click="handleDelete(scope.$index, scope.row)">
        </el-button>
        <el-button
          size="mini"
          type="primary" plain
          class="el-icon-download"
          v-if="((scope.row.StorePath.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')==='.zip'"
          @click="handleDownload(scope.$index, scope.row)">
        </el-button>
        <el-button
          size="mini"
          type="danger"
          class="el-icon-delete"
          v-if="((scope.row.StorePath.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')==='.zip'"
          @click="handleDelete(scope.$index, scope.row)">
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    title="上传文件"
    :visible.sync="dialogVisible"
    width="50%"
    center>
    <FileUpload></FileUpload>
  </el-dialog>
  </div>
</template>

<script>
import FileUpload from '@/components/video/FileUpload'
export default {
  name: 'VideosLayout',
  components: {
    FileUpload
  },
  data () {
    return {
      timedata: [],
      video_urls: [],
      // video_path: '',
      // path_if: false,
      dialogVisible: false
    }
  },
  mounted: function () {
    this.showVideo()
  },
  methods: {
    // 创建上传文件窗口
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    showVideo () {
      let that = this
      this.$axios({
        method: 'get',
        url: '/display/human-resources/file-manage/videoInfo'
      }).then(function (response) {
        var res = response.data
        console.log(res)
        if (res !== null) {
          for (var u = 0; u < res.length; u++) {
            // console.log(res[u]['UploadTime'])
            let dt = new Date(res[u]['UploadTime'])
            let month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
            let day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
            let hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()
            let min = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()
            let sec = dt.getSeconds() < 10 ? '0' + dt.getSeconds() : dt.getSeconds()
            // console.log(dt.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec)
            res[u]['UploadTime'] = dt.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec
            // console.log(res[u]['UploadTime'])
            // console.log(res[u]['StorePath'])
            // console.log(typeof (res[u]['StorePath']))
            // that.video_path = ((res[u]['StorePath'].split('').reverse().join('')).substring(0, 4)).split('').reverse().join('')
            // ((item.KPIName.split("").reverse().join("")).substring(0,2)).split("").reverse().join("")
            // console.log(that.video_path)
            // console.log(typeof (res[u]['StorePath']))
            // if (that.video_path === '.mp4') {
            //   that.path_if = true
            // } else {
            //   that.path_if = false
            // }
          }
          that.video_urls = res.reverse()
          console.log(that.video_urls)
          console.log(typeof (that.video_urls))
        } else {
          that.$message.error('查询视频失败')
          console.log(res['msg'])
        }
      }).catch(function (err) {
        console.log(err)
        if (err.response.status === 401) {
          alert('用户未登录或登录已过期')
          localStorage.clear()
          that.$router.push({path: '/user/login/'})
          window.location.reload()
        } else if (err.response.status === 403) {
          that.$message({
            type: 'error',
            message: '权限不够！'
          })
        } else if (err.response.status === 404) {
          that.$message({
            type: 'error',
            message: '找不到数据！'
          })
        } else if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        }
      })
    },
    handleRun (index, row) {
      console.log(row)
      console.log(this.video_urls[index].StorePath)
      const {href} = this.$router.resolve({path: '/video', query: {'StorePath': this.video_urls[index].StorePath}})
      window.open(href, '_blank')
    },
    handleDownload (index, row) {
      console.log(row)
      console.log(this.video_urls[index].StorePath)
      const url = 'http://172.20.3.201:8002' + this.video_urls[index].StorePath
      // url = encodeURI(url)
      window.location.href = url
      // window.open(url, '_blank')
    },
    handleDelete (index, row) {
      let that = this
      console.log(row)
      that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'delete',
          url: '/display/human-resources/file-manage/videoInfo/' + row['ID']
        }).then(function (response) {
          that.$message({
            type: 'success',
            message: '删除成功!'
          })
          that.video_urls.splice(index, 1)
        })
      })
    }
  }
}
</script>

<style scoped>
.file >>> .el-col-offset-8{
  margin-left: 20%;
}
.grid{
  background: #d3dce6;
}
.files{
  font-size:20px;
}

</style>
