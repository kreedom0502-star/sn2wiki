# 数据结构规范

本项目把资料内容尽量放在 `assets/data/*.json` 中，HTML 负责页面结构，JavaScript 负责读取、筛选和渲染。这样后续更新 Early Access 内容时，不需要反复改页面模板。

## 通用格式

每个数据文件都使用统一外层结构：

```json
{
  "schemaVersion": 1,
  "kind": "resources",
  "updatedAt": "2026-05-23",
  "records": []
}
```

通用字段：

- `id`：稳定唯一 ID，使用英文小写和连字符。
- `name`：中文显示名。
- `aliases`：搜索别名，可包含英文名、中文别称、常见错写。
- `category`：内容类别，如 `ore`、`tool`、`vehicle`。
- `stage`：游戏阶段，建议用 `early`、`mid`、`late`、`unknown`。
- `version`：适用版本，如 `ea-1.0`、`unknown`。
- `status`：资料状态，建议用 `placeholder`、`needs-verification`、`verified`、`outdated`。
- `lastVerified`：最后实测日期，未实测填 `null`。
- `summary`：一句话快速答案或用途说明。
- `notes`：维护备注或风险提示。
- `relatedGuides`：关联攻略页面路径数组。
- `mapPointIds`：关联地图点位 ID 数组。

## resources.json

资源条目用于资源位置页、首页搜索和地图点位反查。

核心字段：

- `resourceType`：如 `ore`、`plant`、`material`、`crafted`。
- `rarity`：如 `common`、`uncommon`、`rare`、`unknown`。
- `uses`：用途数组，写玩家能理解的制作链。
- `locations`：区域数组。未实测时使用 `name: "待实测区域"`。
- `relatedBlueprintIds`：会用到该资源的蓝图 ID。
- `relatedRecipeIds`：会用到该资源的配方 ID。

## blueprints.json

蓝图条目用于蓝图页、配方前置条件和地图扫描点。

核心字段：

- `blueprintType`：如 `tool`、`base`、`vehicle`、`module`。
- `unlockMethod`：如 `scan`、`story`、`crafting`、`unknown`。
- `fragmentsRequired`：需要扫描碎片数量，未知填 `null`。
- `prerequisites`：前置条件数组。
- `relatedResourceIds`：相关资源 ID。
- `relatedRecipeIds`：相关配方 ID。

## recipes.json

配方条目用于配方页和材料反查。

核心字段：

- `recipeType`：如 `tool`、`survival`、`base`、`vehicle`、`module`。
- `craftedItemId`：产物 ID，可指向蓝图或资源。
- `requiresBlueprintId`：前置蓝图 ID，未知填 `null`。
- `materials`：材料数组，每项包含 `resourceId`、`name`、`quantity`、`status`。

## map-points.json

地图点位用于互动地图。第一阶段可以使用百分比坐标，等有正式地图底图后再替换为游戏坐标或地图坐标系。

核心字段：

- `pointType`：如 `resource`、`blueprint`、`base`、`danger`、`biome`。
- `position`：地图百分比坐标，包含 `xPercent` 和 `yPercent`。
- `gameCoordinates`：游戏内坐标，未验证填 `null`。
- `areaName`：区域名。
- `riskLevel`：风险等级，如 `low`、`medium`、`high`、`unknown`。
- `linkedRecordIds`：关联资料 ID 数组。
- `routeHint`：路线提示，未实测时明确写待补充。

## updates.json

更新条目用于版本追踪页。

核心字段：

- `version`：版本名。
- `date`：发布日期或整理日期。
- `sourceUrl`：官方来源链接，没有则填 `null`。
- `summary`：中文摘要。
- `impact`：对本站资料的影响。
- `affectedRecordIds`：受影响的资源、蓝图、配方或地图点位 ID。

## 内容状态约定

- `placeholder`：仅用于页面演示，不可当攻略结论。
- `needs-verification`：有方向或待验证资料，需要游戏内实测。
- `verified`：已按当前版本实测。
- `outdated`：版本更新后可能失效，等待复核。
