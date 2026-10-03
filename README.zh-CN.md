<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.png">
    <img src="assets/banner-light.png" width="560" alt="Yakuman FX">
  </picture>
</p>

<p align="center"><b>在浏览器中启用雀魂原生役满动画。</b></p>

<p align="center">
  <a href="https://github.com/Chaldeaaa/yakuman-fx/releases"><img src="https://img.shields.io/badge/version-0.3.0-fa8072?style=flat-square" alt="版本 0.3.0"></a>
  <img src="https://img.shields.io/badge/browser-Chrome%20%2F%20Edge-555860?style=flat-square" alt="Chrome 与 Edge 桌面版">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0-fa8072?style=flat-square" alt="GPL-3.0-only"></a>
  <img src="https://img.shields.io/badge/status-preview-555860?style=flat-square" alt="预览版">
</p>

<p align="center"><a href="README.md">English</a> · <b>简体中文</b></p>

<p align="center"><a href="https://github.com/Chaldeaaa/yakuman-fx/releases"><b>下载</b></a> · <a href="docs/INSTALL.zh-CN.md">安装教程</a> · <a href="https://github.com/Chaldeaaa/yakuman-fx/issues">反馈问题</a></p>

---

Yakuman FX 使用实际和牌手牌，恢复游戏内置的 Unity 役满特效。安装后在大厅启用一次，以后打开游戏就会自动启用。无需 Steam 客户端、桌面辅助程序或命令行窗口。扩展界面支持 English／简体中文，可通过右上角齿轮进入设置切换语言，并选择浅色／深色／跟随系统主题。

> [!WARNING]
> **账号风险与免责声明：** 本项目是非官方客户端修改工具，与雀魂及其运营方无关联，也未获得其认可。使用本工具可能违反游戏规则或服务条款，导致账号限制、暂时封禁或永久封禁。本项目不保证账号安全，使用风险由用户自行承担。软件不提供担保，详见 [LICENSE](LICENSE)。

## 目录

- [功能](#功能)
- [支持范围](#支持范围)
- [快速安装](#快速安装)
- [恢复与更新](#恢复与更新)
- [常见问题](#常见问题)
- [实现方式](#实现方式)
- [开发](#开发)
- [许可证](#许可证)

## 功能

| 原生特效 | 一次启用 | 便捷控制 |
| :---: | :---: | :---: |
| 根据真实和牌手牌播放飞牌与役满动画。 | 在大厅启用一次，以后加载游戏自动生效。 | Restore Default 关闭自动启用，设置中可选择浅色、深色或跟随系统。 |

> [!NOTE]
> 官方资源在本地校验，未知客户端构建不会被修改。

---

## 支持范围

| 游戏入口 | 客户端构建 | 验证情况 |
| --- | --- | --- |
| [中文入口](https://game.maj-soul.com/1/) | `chs_t-WebGL-release-4.0.47(47)` | 可用 |
| [国际服入口](https://mahjongsoul.game.yo-star.com/) | `en-WebGL-release-4.0.10(11)` | 可用 |
| [日服入口](https://game.mahjongsoul.com/) | `jp-WebGL-release-4.0.12(13)` | 可用 |

面向 Chrome／Edge 桌面版，要求 Chromium 118 或更新版本。实战动画入口已启用，但实战播放、其他役满及完整音效覆盖尚未验证。此发行包不支持移动浏览器、Firefox 或桌面游戏客户端。

## 快速安装

**下载 → 解压 → 加载扩展 → 大厅启用**

1. 从 [Releases](https://github.com/Chaldeaaa/yakuman-fx/releases) 下载并解压 `yakuman-fx-v0.3.1.zip`。如果尚未发布 Release，可下载仓库源码，使用其中的 `extension/` 文件夹。
2. 打开 `edge://extensions` 或 `chrome://extensions`，开启 **开发者模式**。
3. 点击 **加载解压缩的扩展**，选择包含 `manifest.json` 的文件夹。
4. 打开支持的雀魂入口，停留在大厅，点击扩展内的 **Enable & Reload**。
5. 确认大厅提醒，等待状态显示 **Native effects loaded.**

> [!IMPORTANT]
> 保留解压后的文件夹。**不要在对局中刷新游戏。**

以后加载游戏会自动启用，无需 Node.js、Python 或本地服务器。浏览器可能提示正在使用开发者模式扩展。

详细的文件夹选择、首次启用、更新及卸载步骤见 [安装教程](docs/INSTALL.zh-CN.md)。本项目通过手动安装分发，不通过扩展商店发布。

## 恢复与更新

**恢复：** 点击 **Restore Default**，然后在大厅刷新游戏，移除当前页面已加载的临时修改。卸载时，在浏览器扩展管理页移除扩展，并刷新游戏。

**更新：** 关闭游戏，用新版文件覆盖原安装文件夹，在扩展管理页点击此扩展的 **重新加载** 按钮，再打开游戏。更新需要手动进行。

## 常见问题

| 现象 | 处理方式 |
| --- | --- |
| 一直显示 Waiting for verified resource reads. | 安装钩子并不代表验证成功。从 **扩展程序选项** 查看已保存的诊断，在大厅重试。 |
| 资源校验失败或客户端不支持 | 客户端／缓存可能与已知构建不同。保持未修改状态，检查扩展更新；反馈时提供诊断。 |
| 加载成功但没有动画 | 提供浏览器及扩展版本、服务器入口、牌谱信息和诊断。实战与其他役满尚未完整验证。 |

诊断入口在浏览器扩展管理页的 **选项／扩展程序选项** 中。反馈时不要上传账号凭据、认证令牌或浏览器配置文件。

## 实现方式

已检查的 WebGL 客户端保留了原生役满控制器，但关闭了动画入口并跳过相应资源组。扩展恢复这两条路径，同时修正飞牌音效通道。实际和牌手牌由游戏控制器提供，不是播放录像。

扩展校验官方框架和资源包，在本地执行三处等长脚本修改，再将验证通过的读取指向 Unity 临时虚拟文件。原持久缓存写入不变，未知资源会被拒绝修改。

没有分析统计、广告、遥测服务或开发者运营的服务器。官方资源从游戏域名或官方资源 CDN 下载并在本地处理。扩展不拦截游戏 WebSocket 消息，也不主动读取账号凭据；这些行为不构成账号安全保证。权限和数据处理详情见 [隐私说明](PRIVACY.md)。

## 开发

测试需要 Node.js 22 或更新版本：

```sh
npm test
```

测试覆盖 LZ4、UnityFS 重建、资源与缓存校验、导航范围及恢复流程。自动测试不能替代动画和音效播放验证。

## 许可证

本项目原创代码使用 [GPL-3.0-only](LICENSE)。分发修改版时需要遵守 GPL 的源码及许可证要求。此许可证不授予雀魂专有代码或资源的权利；相关权利归原权利人所有。
