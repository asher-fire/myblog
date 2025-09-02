---
title: '作为GitLab Developer角色基于已有项目创建新项目，并保留 Commit 历史'
date: '2025-09-02'
tags: ['gitLab']
draft: false
summary: "在 GitLab 中，Developer 角色如何基于已有项目创建新项目，并且保留 Git commit 历史"
---

在 GitLab Groups 下，如果被赋予了 **Developer** 权限，是可以创建新仓库/项目(new Project)的。

在新建项目的时候，如果是基于一个老项目去创建，而且希望新项目有老项目的git commit提交历史，可以这样操作：

![gitLab新建项目截图](/static/images/gitLab/developer-new-project-from-other-project/err1.png)

注意：
- 账号和密码，虽然是可选(optional)，建议还是填上，否则可能会出现导入失败的情况。