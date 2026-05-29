+++
title = "Windows服务进程配置文件"
date = 2026-05-28T09:22:25.280704+00:00
draft = false
slug = "service"
source_path = "System/Windows/service.md"
categories = ["System", "Windows"]
tags = ["System", "Windows"]
+++

# Windows服务进程配置文件

以`RustDesk`为例，正常前台运行的程序配置文件位于：

`C:\Users\username\AppData\Roaming\RustDesk\config\RustDesk.toml`

但是当其注册为服务进程，在后台运行时，其使用的配置文件位于，且会覆盖上面的文件：

`C:\Windows\ServiceProfiles\LocalService\AppData\Roaming\RustDesk\config\RustDesk.toml`
