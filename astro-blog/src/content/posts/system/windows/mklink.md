---
title: "Windows下mklink用法"
published: 2023-12-24
draft: false
description: "Migrated from md-notes/System/Windows/mklink.md"
category: "System"
tags:
  - "System"
  - "Windows"
author: xin
sourceLink: "md-notes/System/Windows/mklink.md"
comment: false
---
```shell
MKLINK [[/D] | [/H] | [/J]] Link Target

        /D      创建目录符号链接。默认为文件
                符号链接。
        /H      创建硬链接而非符号链接。
        /J      创建目录联接。
        Link    指定新的符号链接名称。
        Target  指定新链接引用的路径
                (相对或绝对)。
```
