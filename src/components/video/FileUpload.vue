<template>
  <div class="upload_file">
    <el-row :gutter="20">
    <el-col :span="14" :offset="8"><div class="grid-content bg-purple">
      <el-input
        placeholder="请输入内容"
        v-model="filenickname"
        maxlength="40"
        show-word-limit
        clearable>
      <template slot="prepend">文件命名:</template>
      </el-input>
    </div></el-col>
    </el-row>

    <el-row :gutter="20">
    <el-col :span="14" :offset="8"><div class="grid-content bg-purple">
      <input type="file" id="myfile" accept=".mp4,.rar,.zip">
      <el-button type="primary submit" @click.prevent="upload" style="float: right; height: auto">上传</el-button>
    </div></el-col>
    </el-row>

    <el-row :gutter="20">
    <el-col :span="14" :offset="8"><div class="grid-content ">
      <el-progress type="line" :percentage="percentage" class="progress" :show-text="true"></el-progress>
    </div></el-col>
    </el-row>

    <el-dialog
      title="提示"
      :visible="dialogVisible"
      width="30%"
      :modal-append-to-body='false'>
      <span>文件上传成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
<!--    <button type="submit" @click.prevent="upload">上传</button>-->
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  name: 'FileUpload',
  data () {
    return {
      filenickname: '',
      percentage: 0,
      dialogVisible: false
    }
  },
  methods: {
    upload () {
      // eslint-disable-next-line camelcase
      let form_data = new FormData()
      const myfile = document.getElementById('myfile').files[0]
      // console.log(((myfile.name.split("").reverse().join("")).substring(0,2)).split("").reverse().join("") === '.rar')
      // console.log(myfile.name)
      if (this.filenickname.length === 0) {
        this.filenickname = myfile.name
        // console.log('1')
      } else {
        if (((myfile.name.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('') === '.rar') {
          this.filenickname = this.filenickname + '.rar'
        } else if (((myfile.name.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('') === '.zip') {
          this.filenickname = this.filenickname + '.zip'
        } else if (((myfile.name.split('').reverse().join('')).substring(0, 4)).split('').reverse().join('') === '.mp4') {
          this.filenickname = this.filenickname + '.mp4'
        }
      }
      form_data.append('uploader', localStorage.getItem('nickname'))
      form_data.append('videoFile', myfile, this.filenickname)
      console.log(form_data)
      let that = this
      that.$axios({
        url: '/display/human-resources/file-manage/videoInfo',
        method: 'post',
        data: form_data,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          let complete = (progressEvent.loaded / progressEvent.total).toFixed(2) * 100
          that.percentage = complete
          if (complete >= 100) {
            that.percentage = 0
            that.dialogVisible = true
          }
        }
      }).then(res => {
        console.log(res)
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
            message: '未找到数据！'
          })
        } else if (err.response.status === 504) {
          that.$message({
            type: 'error',
            message: '服务器未响应！'
          })
        }
      })
    },
    ensure () {
      this.dialogVisible = false
      this.reload()
    }
  }
}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 40px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  input#myfile {
    float: left;
    font-size: 25px;
  }

</style>
