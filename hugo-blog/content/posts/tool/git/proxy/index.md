+++
title = "Git设置代理"
date = 2026-05-28T09:22:25.282851+00:00
draft = false
slug = "proxy"
source_path = "Tool/Git/proxy.md"
categories = ["Tool", "Git"]
tags = ["Tool", "Git"]
+++

# Git设置代理

```shell
# 为 git 设置全局代理
git config --global https.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890

# 取消设置代理
git config --global --unset http.proxy
git config --global --unset https.proxy

# 查看设置代理
git config --global --get http.proxy
git config --global --get https.proxy
```
