# 费子隽 · 个人作品集

静态作品集网站。首页为 `index.html`，样式为 `style.css`，交互为 `app.js`，图集配置为 `galleries.js`。

## 发布与素材

GitHub Pages 使用 GitHub Actions。提交 main 后自动更新。

图片、简历、字体和完整视频保存在本仓库 `portfolio-media-v1` Release 的 `portfolio-assets-v1.zip` 附件中。`assemble.py` 下载素材并生成 `_site/`，原始素材位于 `_site/assets/`。无需将大视频重复上传到 Git 历史。

## 简历

所有简历入口使用相对路径 `assets/zijun-fei-resume.pdf`，兼容 `/portfolio/` 子路径。

## 后续修改

修改网页后提交 main 即可。更新素材时创建新的 Release 附件，并同步调整 `assemble.py` 中的素材地址。
