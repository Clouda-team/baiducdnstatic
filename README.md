## Baidu Open CDN Service

### 提交一个库

#### Step 1

需要了解Github开源库目录的结构，新的库需要在libs下新建库目录及其版本目录，并将文件放在相应目录下，最后补全package.json文件。

			
```
  ├── backbone.js               # ... library
  │   ├── 1.1.0                 # ... version
  │   |   └── backbone.js       # ... fileanme
  │   └── 1.1.1
  │       └── backbone.js
  └── package.json              # ... package.json
```
			
####Step 2

编辑package.json描述文件，这个文件描述最新版本的信息。

```
  // 项目名必须与文件夹名一致
  {
    "name": "项目名",
    "filename": "主文件名，比如 abc.js",
    "version": "1.0",
    "description": "项目简介",
    "homepage": "项目主页/网站地址",
    "keywords": ["关键字1", "关键字2", "关键字3"],
    "maintainers": [
  	{
  	  "name": "作者/维护者",
  	  "web": "作者/维护者个人主页",
  	  "mail": "作者/维护者邮件"
  	}
    ],
    "repositories": [
  	{
  	  "type": "git",
  	  "url": "开源库地址"
  	}
    ]
  }
```
			
#### Step 3

随时欢迎给我们提Pull Request。

