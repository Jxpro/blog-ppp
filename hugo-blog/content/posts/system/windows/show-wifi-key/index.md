+++
title = "查看电脑连接的wifi密码"
date = 2026-05-28T09:22:25.280846+00:00
draft = false
slug = "show-wifi-key"
source_path = "System/Windows/show_wifi_key.md"
categories = ["System", "Windows"]
tags = ["System", "Windows"]
+++

# 查看电脑连接的wifi密码

打开`CMD`（`Terminal`不行），输入以下指令，查看电脑连接过的WiFi名称

```shell
netsh wlan show profiles
```

![list](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/2021/11/17-220534.png)

输入以下指令，查看该WiFi名称的详细信息，如下图所示：

```shell
netsh wlan show profiles WiFi名称 key=clear
```

![cont](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/2021/11/17-220817.png)

提示：如果WiFi名称为汉字不能输入，可以在其它地方输入后复制粘贴。
