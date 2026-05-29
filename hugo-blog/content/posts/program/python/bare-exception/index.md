+++
title = "PEP 8: do not use bare 'exept'"
date = 2026-05-28T09:22:25.274895+00:00
draft = false
slug = "bare-exception"
source_path = "Program/Python/bare_exception.md"
categories = ["Program", "Python"]
tags = ["Program", "Python"]
+++

# PEP 8: do not use bare 'exept'

[TOC]

## 错误描述

![image-20211112222512429](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/2021/11/12-222513.png)

## 原因一：[Flake8 Rules](https://www.flake8rules.com/)

>   Do not use bare except, specify exception instead (E722)

解决方法：`Inspection`的`option`里添加`E722`项

![image-20211112222613037](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/2021/11/12-222614.png)

## 原因二：Unclear exception clauses

解决方法：取消勾选`Unclear exception clauses`

![image-20211112222736678](https://raw.githubusercontent.com/Jxpro/PicBed/master/md/2021/11/12-222738.png)
