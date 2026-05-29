---
title: "iTunes升级ipad报错"
published: 2024-01-31
draft: false
description: "Migrated from md-notes/System/MacOS/Ipad_update.md"
category: "System"
tags:
  - "System"
  - "MacOS"
author: xin
sourceLink: "md-notes/System/MacOS/Ipad_update.md"
comment: false
---
## 一、跳过备份直接更新

### Windows

确保**iTunes已关闭**，进入`terminal`，输入以下指令

```shell
"D:\Program Files\iTunes\defaults.exe" write com.apple.iTunes AutomaticDeviceBackupsDisabled -bool true
# 或
"%CommonProgramFiles%\Apple\Apple Application Support\defaults.exe" write com.apple.iTunes AutomaticDeviceBackupsDisabled -bool true
```

### MacOS

确保**iTunes已关闭**，打开`terminal`，输入以下指令

```shell
defaults write com.apple.iTunes AutomaticDeviceBackupsDisabled -bool true
```

## 二、4000错误的解决办法

-   只需暂时关闭**屏幕密码**就可以了！！！
