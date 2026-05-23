const FALLBACK_DATA = {
  resources: {
    records: [
      {
        id: "silver-ore",
        name: "银矿",
        aliases: ["silver", "silver ore", "银", "银矿石"],
        category: "ore",
        resourceType: "ore",
        stage: "early",
        version: "unknown",
        status: "needs-verification",
        lastVerified: null,
        rarity: "uncommon",
        summary: "前期电子元件和升级材料常见需求，正式位置等待游戏内实测。",
        uses: ["电子元件", "工具制作", "升级材料"],
        locations: [{ name: "待实测区域", notes: "等待游戏内实测路线。" }],
        relatedBlueprintIds: ["scanner"],
        relatedRecipeIds: ["high-capacity-o2-tank"],
        relatedGuides: ["resources.html#silver-ore"],
        mapPointIds: ["map-silver-sample"],
        notes: "首批高搜索意图资源页。"
      },
      {
        id: "copper-ore",
        name: "铜矿",
        aliases: ["copper", "copper ore", "铜", "铜矿石"],
        category: "ore",
        resourceType: "ore",
        stage: "early",
        version: "unknown",
        status: "needs-verification",
        lastVerified: null,
        rarity: "common",
        summary: "常见基础材料，用于电线、基础工具和早期设备。",
        uses: ["电线", "基础工具", "早期设备"],
        locations: [{ name: "待实测区域", notes: "后续补充出生点附近路线。" }],
        relatedBlueprintIds: ["scanner"],
        relatedRecipeIds: ["scanner-recipe"],
        relatedGuides: ["resources.html#copper-ore"],
        mapPointIds: [],
        notes: "适合做前期资源合集页。"
      }
    ]
  },
  blueprints: {
    records: [
      {
        id: "scanner",
        name: "扫描器",
        aliases: ["scanner", "扫描工具"],
        category: "tool",
        blueprintType: "tool",
        stage: "early",
        version: "unknown",
        status: "needs-verification",
        lastVerified: null,
        summary: "用于扫描蓝图、生物和环境资料，是资料库内容链路里的关键工具。",
        unlockMethod: "unknown",
        fragmentsRequired: null,
        prerequisites: [],
        relatedResourceIds: ["copper-ore", "silver-ore"],
        relatedRecipeIds: ["scanner-recipe"],
        relatedGuides: ["guides/beginner-route.html"],
        mapPointIds: ["map-scanner-sample"],
        notes: "正式攻略需要补充获取方式和版本。"
      }
    ]
  },
  recipes: {
    records: [
      {
        id: "scanner-recipe",
        name: "扫描器",
        aliases: ["scanner recipe", "扫描器配方"],
        category: "tool",
        recipeType: "tool",
        stage: "early",
        version: "unknown",
        status: "needs-verification",
        lastVerified: null,
        summary: "扫描蓝图、生物和环境资料的基础工具配方，材料数量等待实测。",
        craftedItemId: "scanner",
        requiresBlueprintId: "scanner",
        materials: [
          { resourceId: "copper-ore", name: "铜矿样例", quantity: null, status: "needs-verification" },
          { resourceId: null, name: "电池样例", quantity: null, status: "placeholder" }
        ],
        relatedGuides: ["guides/beginner-route.html"],
        mapPointIds: [],
        notes: "不要把样例材料当作正式配方。"
      }
    ]
  },
  updates: {
    records: [
      {
        id: "ea-launch-tracker",
        version: "Early Access",
        date: "2026-05-14",
        title: "EA 版本资料库结构启动",
        sourceUrl: null,
        summary: "建立版本追踪页面，用来记录官方更新、资料影响范围和需要复核的攻略。",
        impact: "所有资源、蓝图、配方和地图点位都需要标注版本。",
        affectedRecordIds: ["silver-ore", "scanner", "scanner-recipe", "map-silver-sample"],
        status: "needs-verification",
        relatedGuides: ["updates.html"],
        notes: "正式整理更新日志时应补充官方来源链接。"
      }
    ]
  },
  "map-points": {
    records: [
      {
        id: "map-silver-sample",
        name: "银矿样例点",
        aliases: ["silver sample point"],
        category: "resource",
        pointType: "resource",
        stage: "early",
        version: "unknown",
        status: "placeholder",
        lastVerified: null,
        summary: "用于演示资源点筛选，正式坐标后续替换。",
        position: { xPercent: 34, yPercent: 42 },
        gameCoordinates: null,
        areaName: "待实测区域",
        riskLevel: "unknown",
        linkedRecordIds: ["silver-ore"],
        routeHint: "等待游戏内实测路线。",
        relatedGuides: ["resources.html#silver-ore"],
        notes: "占位点位，不代表真实资源位置。"
      }
    ]
  }
};

const LABELS = {
  all: "全部",
  early: "前期",
  mid: "中期",
  late: "后期",
  unknown: "未知",
  common: "常见",
  uncommon: "较少",
  rare: "稀有",
  tool: "工具",
  base: "基地",
  vehicle: "载具",
  module: "模块",
  survival: "生存",
  resource: "资源",
  blueprint: "蓝图",
  danger: "危险",
  biome: "生物群系",
  placeholder: "占位",
  "needs-verification": "待实测",
  verified: "已验证",
  outdated: "待复核",
  scan: "扫描",
  story: "剧情",
  crafting: "制作",
  low: "低风险",
  medium: "中风险",
  high: "高风险"
};

const basePath = document.body.dataset.base || ".";
const page = document.body.dataset.page || "";

document.addEventListener("DOMContentLoaded", () => {
  if (page === "home") initHomeSearch();
  if (page === "resources") initResources();
  if (page === "blueprints") initBlueprints();
  if (page === "recipes") initRecipes();
  if (page === "updates") initUpdates();
  if (page === "map") initMap();
});

async function loadDataset(name) {
  try {
    const response = await fetch(`${basePath}/assets/data/${name}.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load ${name}`);
    return await response.json();
  } catch (error) {
    return FALLBACK_DATA[name] || { records: [] };
  }
}

async function loadRecords(name) {
  const dataset = await loadDataset(name);
  return Array.isArray(dataset) ? dataset : dataset.records || [];
}

function label(value) {
  return LABELS[value] || value || "未标注";
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function searchableText(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(searchableText).join(" ");
  if (typeof value === "object") return Object.values(value).map(searchableText).join(" ");
  return String(value);
}

function matchesQuery(item, query) {
  if (!query) return true;
  return normalize(searchableText(item)).includes(query);
}

function setActiveButton(buttons, activeButton) {
  buttons.forEach((button) => button.classList.toggle("active", button === activeButton));
}

function renderTags(values) {
  return values.filter(Boolean).map((value) => `<span>${label(value)}</span>`).join("");
}

function firstLink(item, fallback) {
  return item.relatedGuides?.[0] || fallback;
}

async function initHomeSearch() {
  const input = document.querySelector("#site-search");
  const results = document.querySelector("#search-results");
  if (!input || !results) return;

  const [resources, blueprints, recipes, updates] = await Promise.all([
    loadRecords("resources"),
    loadRecords("blueprints"),
    loadRecords("recipes"),
    loadRecords("updates")
  ]);

  const source = [
    ...resources.map((item) => ({ title: item.name, type: "资源", href: `resources.html#${item.id}`, note: item.summary, raw: item })),
    ...blueprints.map((item) => ({ title: item.name, type: "蓝图", href: "blueprints.html", note: item.summary, raw: item })),
    ...recipes.map((item) => ({ title: item.name, type: "配方", href: "recipes.html", note: item.summary, raw: item })),
    ...updates.map((item) => ({ title: item.title, type: "更新", href: "updates.html", note: item.summary, raw: item }))
  ];

  const render = () => {
    const query = normalize(input.value);
    if (!query) {
      results.innerHTML = "";
      return;
    }
    const matched = source.filter((item) => matchesQuery(item.raw, query)).slice(0, 6);
    results.innerHTML = matched.length
      ? matched.map((item) => `
          <a class="search-result" href="${item.href}">
            <strong>${item.title}</strong>
            <span>${item.type}</span>
          </a>
        `).join("")
      : `<div class="empty-state">还没有匹配资料，可以把这个词加入内容计划。</div>`;
  };

  input.addEventListener("input", render);
  window.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== input) {
      event.preventDefault();
      input.focus();
    }
  });
}

async function initResources() {
  const grid = document.querySelector("#resource-grid");
  const input = document.querySelector("#resource-search");
  const buttons = [...document.querySelectorAll("[data-resource-filter]")];
  const data = await loadRecords("resources");
  let active = "all";

  const render = () => {
    const query = normalize(input?.value);
    const items = data.filter((item) => {
      const inFilter = active === "all" || item.stage === active || item.rarity === active || item.resourceType === active;
      return inFilter && matchesQuery(item, query);
    });

    grid.innerHTML = items.length
      ? items.map((item) => `
          <article id="${item.id}" class="data-card">
            <span class="tag">${label(item.stage)}</span>
            <strong>${item.name}</strong>
            <p>${item.summary}</p>
            <div class="data-meta">
              ${renderTags([item.rarity, item.status, item.version])}
            </div>
            <small>常见用途：${item.uses?.join("、") || "待补充"}</small>
          </article>
        `).join("")
      : `<div class="empty-state">没有找到匹配资源。</div>`;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      active = button.dataset.resourceFilter;
      setActiveButton(buttons, button);
      render();
    });
  });
  input?.addEventListener("input", render);
  render();
}

async function initBlueprints() {
  const list = document.querySelector("#blueprint-list");
  const input = document.querySelector("#blueprint-search");
  const buttons = [...document.querySelectorAll("[data-blueprint-filter]")];
  const data = await loadRecords("blueprints");
  let active = "all";

  const render = () => {
    const query = normalize(input?.value);
    const items = data.filter((item) => {
      const inFilter = active === "all" || item.blueprintType === active || item.category === active;
      return inFilter && matchesQuery(item, query);
    });

    list.innerHTML = items.length
      ? items.map((item) => `
          <article class="list-card">
            <span class="tag">${label(item.blueprintType)}</span>
            <strong>${item.name}</strong>
            <p>${item.summary}</p>
            <div class="data-meta">
              ${renderTags([item.unlockMethod, item.status, item.version])}
            </div>
            <small>关联资源：${item.relatedResourceIds?.join("、") || "待补充"}</small>
          </article>
        `).join("")
      : `<div class="empty-state">没有找到匹配蓝图。</div>`;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      active = button.dataset.blueprintFilter;
      setActiveButton(buttons, button);
      render();
    });
  });
  input?.addEventListener("input", render);
  render();
}

async function initRecipes() {
  const grid = document.querySelector("#recipe-grid");
  const input = document.querySelector("#recipe-search");
  const buttons = [...document.querySelectorAll("[data-recipe-filter]")];
  const data = await loadRecords("recipes");
  let active = "all";

  const render = () => {
    const query = normalize(input?.value);
    const items = data.filter((item) => {
      const inFilter = active === "all" || item.recipeType === active || item.category === active;
      return inFilter && matchesQuery(item, query);
    });

    grid.innerHTML = items.length
      ? items.map((item) => `
          <article class="data-card">
            <span class="tag">${label(item.recipeType)}</span>
            <strong>${item.name}</strong>
            <p>${item.summary}</p>
            <div class="materials">
              ${item.materials.map((material) => `<span>${material.name}${material.quantity ? ` x${material.quantity}` : ""}</span>`).join("")}
            </div>
            <small>前置蓝图：${item.requiresBlueprintId || "待确认"} · ${label(item.status)}</small>
          </article>
        `).join("")
      : `<div class="empty-state">没有找到匹配配方。</div>`;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      active = button.dataset.recipeFilter;
      setActiveButton(buttons, button);
      render();
    });
  });
  input?.addEventListener("input", render);
  render();
}

async function initUpdates() {
  const list = document.querySelector("#update-list");
  const data = await loadRecords("updates");
  list.innerHTML = data.map((item) => `
    <article class="timeline-item">
      <time datetime="${item.date}">${item.date} · ${item.version}</time>
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
      <small>影响：${item.impact}</small>
    </article>
  `).join("");
}

async function initMap() {
  const pointsLayer = document.querySelector("#map-points");
  const detail = document.querySelector("#map-detail");
  const input = document.querySelector("#map-search");
  const buttons = [...document.querySelectorAll("[data-map-filter]")];
  const data = await loadRecords("map-points");
  let active = "all";

  const renderDetail = (item) => {
    detail.innerHTML = `
      <strong>${item.name}</strong>
      <span>${label(item.pointType)} · ${item.areaName}</span>
      <span>${item.summary}</span>
      <span>状态：${label(item.status)} · 风险：${label(item.riskLevel)}</span>
      <a class="inline-map-link" href="${firstLink(item, "map.html")}">查看相关页面</a>
    `;
  };

  const render = () => {
    const query = normalize(input?.value);
    const items = data.filter((item) => {
      const inFilter = active === "all" || item.pointType === active || item.category === active;
      return inFilter && matchesQuery(item, query);
    });

    pointsLayer.innerHTML = items.map((item) => `
      <button
        class="map-point"
        type="button"
        data-type="${item.pointType}"
        style="left: ${item.position.xPercent}%; top: ${item.position.yPercent}%"
        aria-label="${item.name}"
        data-id="${item.id}">
      </button>
    `).join("");

    pointsLayer.querySelectorAll(".map-point").forEach((button) => {
      button.addEventListener("click", () => {
        const item = data.find((entry) => entry.id === button.dataset.id);
        if (item) renderDetail(item);
      });
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      active = button.dataset.mapFilter;
      setActiveButton(buttons, button);
      render();
    });
  });
  input?.addEventListener("input", render);
  render();
}
