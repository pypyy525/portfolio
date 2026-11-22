# 费子隽 · 个人作品集

静态作品集网站。首页为 `index.html`，样式为 `style.css`，交互为 `app.js`，作品图集配置为 `galleries.js`。

## 部署
GitHub Pages 的 Source 选择 GitHub Actions。推送 main 后自动部署。

图片、简历及视频素材通过 `.partNNN` 分块保存，以兼容 GitHub 网页上传限制。`assemble.py` 按 `media-manifest.json` 合并素材并解压图片资源，保持原始文件内容。运行 `python3 assemble.py` 可生成完整 `_site/`，素材位于 `_site/assets/`。

## 简历
所有简历入口使用相对路径 `assets/zijun-fei-resume.pdf`，兼容 `/portfolio/` 子路径。

## 后续修改
修改网页文字、样式或交互后提交到 main，即可自动更新网站。替换素材时同步更新对应分块及清单；不要直接删除网站仍引用的素材。
