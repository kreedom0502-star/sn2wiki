const FALLBACK_DATA = {
  resources: [
    {
      id: "silver",
      name: "银矿",
      stage: "early",
      rarity: "前期关键",
      use: "电子元件、工具和升级材料的常见需求",
      area: "待实测区域",
      status: "样例数据，等待游戏内验证"
    },
    {
      id: "copper",
      name: "铜矿",
      stage: "early",
      rarity: "常用",
      use: "电线、基础工具和早期设备",
      area: "待实测区域",
      status: "样例数据，等待游戏内验证"
    },
    {
      id: "lead",
      name: "铅",
      stage: "mid",
      rarity: "中期材料",
      use: "基地与防护类制作链",
      area: "待实测区域",
      status: "样例数据，等待游戏内验证"
    },
    {
      id: "titanium",
      name: "钛",
      stage: "early",
      rarity: "基础材料",
      use: "基地结构、工具和大量基础配方",
      area: "待实测区域",
      status: "样例数据，等待游戏内验证"
    },
    {
      id: "rare-sample",
      name: "稀有资源样例",
      stage: "rare",
      rarity: "稀有",
      use: "用于后期升级和特殊配方的条目模板",
      area: "待实测区域",
      status: "占位条目"
    }
  ],
  blueprints: [
    {
      id: "scanner",
      name: "扫描器",
      type: "tool",
      unlock: "待整理蓝图来源",
      related: "蓝图扫描、资源识别、图鉴解锁",
      status: "样例数据"
    },
    {
      id: "base-builder",
      name: "基地建造器",
      type: "base",
      unlock: "待整理蓝图来源",
      related: "基地结构、电力、储物与生产设施",
      status: "样例数据"
    },
    {
      id: "vehicle-bay",
      name: "载具解锁链",
      type: "vehicle",
      unlock: "待整理组件与扫描点",
      related: "载具制造、升级模块、探索深度",
      status: "样例数据"
    }
  ],
  recipes: [
    {
      id: "scanner-recipe",
      name: "扫描器",
      type: "tool",
      materials: ["铜矿样例", "电池样例"],
      purpose: "扫描蓝图、生物和环境资料",
      blueprint: "扫描器"
    },
    {
      id: "oxygen-tank",
      name: "高容量氧气瓶",
      type: "survival",
      materials: ["钛样例", "玻璃样例", "银矿样例"],
      purpose: "延长早期探索时间",
      blueprint: "待确认"
    },
    {
      id: "base-builder-recipe",
      name: "基地建造器",
      type: "base",
      materials: ["钛样例", "电子元件样例"],
      purpose: "建造基地和功能模块",
      blueprint: "基地建造器"
    }
  ],
  updates: [
    {
      version: "Early Access",
      date: "2026-05-14",
      title: "EA 版本资料库结构启动",
      summary: "建立版本追踪页面，用来记录官方更新、资料影响范围和需要复核的攻略。",
      impact: "所有资源、蓝图和地图点位都需要标注版本。"
    },
    {
      version: "资料库规划",
      date: "2026-05-22",
      title: "第一阶段内容框架",
      summary: "优先建设互动地图、资源位置、蓝图坐标、合成配方和新手路线。",
      impact: "先上结构，再逐步填充实测内容。"
    }
  ],
  mapPoints: [
    {
      id: "point-silver",
      name: "银矿样例点",
      type: "resource",
      x: 34,
      y: 42,
      area: "待实测区域",
      note: "用于演示资源点筛选，正式坐标后续替换。",
      link: "resources.html#silver"
    },
    {
      id: "point-scanner",
      name: "扫描器蓝图样例",
      type: "blueprint",
      x: 58,
      y: 35,
      area: "待实测区域",
      note: "用于演示蓝图点位弹窗。",
      link: "blueprints.html"
    },
    {
      id: "point-base",
      name: "前期基地候选区",
      type: "base",
      x: 46,
      y: 62,
      area: "待评估区域",
      note: "后续按资源密度、危险度和交通路线评分。",
      link: "guides/index.html"
    },
    {
      id: "point-danger",
      name: "危险区域样例",
      type: "danger",
      x: 71,
      y: 55,
      area: "待实测区域",
      note: "用于提示高风险生物或深度限制。",
      link: "map.html"
    }
  ]
};

const TYPE_LABELS = {
  early: "前期",
  mid: "中期",
  rare: "稀有",
  tool: "工具",
  base: "基地",
  vehicle: "载具",
  survival: "生存",
  resource: "资源",
  blueprint: "蓝图",
  danger: "危险"
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

async function loadData(name) {
  try {
    const response = await fetch(`${basePath}/assets/data/${name}.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load ${name}`);
    return await response.json();
  } catch (error) {
    if (name === "map-points") return FALLBACK_DATA.mapPoints;
    return FALLBACK_DATA[name] || [];
  }
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesQuery(item, query) {
  if (!query) return true;
  return normalize(Object.values(item).flat().join(" ")).includes(query);
}

function setActiveButton(buttons, activeButton) {
  buttons.forEach((button) => button.classList.toggle("active", button === activeButton));
}

async function initHomeSearch() {
  const input = document.querySelector("#site-search");
  const results = document.querySelector("#search-results");
  if (!input || !results) return;

  const [resources, blueprints, recipes, updates] = await Promise.all([
    loadData("resources"),
    loadData("blueprints"),
    loadData("recipes"),
    loadData("updates")
  ]);

  const source = [
    ...resources.map((item) => ({ title: item.name, type: "资源", href: `resources.html#${item.id}`, note: item.use })),
    ...blueprints.map((item) => ({ title: item.name, type: "蓝图", href: "blueprints.html", note: item.related })),
    ...recipes.map((item) => ({ title: item.name, type: "配方", href: "recipes.html", note: item.purpose })),
    ...updates.map((item) => ({ title: item.title, type: "更新", href: "updates.html", note: item.summary }))
  ];

  const render = () => {
    const query = normalize(input.value);
    if (!query) {
      results.innerHTML = "";
      return;
    }
    const matched = source.filter((item) => matchesQuery(item, query)).slice(0, 6);
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
  const data = await loadData("resources");
  let active = "all";

  const render = () => {
    const query = normalize(input?.value);
    const items = data.filter((item) => (active === "all" || item.stage === active) && matchesQuery(item, query));
    grid.innerHTML = items.length
      ? items.map((item) => `
          <article id="${item.id}" class="data-card">
            <span class="tag">${TYPE_LABELS[item.stage] || item.stage}</span>
            <strong>${item.name}</strong>
            <p>${item.use}</p>
            <div class="data-meta">
              <span>${item.rarity}</span>
              <span>${item.area}</span>
            </div>
            <small>${item.status}</small>
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
  const data = await loadData("blueprints");
  let active = "all";

  const render = () => {
    const query = normalize(input?.value);
    const items = data.filter((item) => (active === "all" || item.type === active) && matchesQuery(item, query));
    list.innerHTML = items.length
      ? items.map((item) => `
          <article class="list-card">
            <span class="tag">${TYPE_LABELS[item.type] || item.type}</span>
            <strong>${item.name}</strong>
            <p>${item.related}</p>
            <div class="data-meta">
              <span>${item.unlock}</span>
              <span>${item.status}</span>
            </div>
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
  const data = await loadData("recipes");
  let active = "all";

  const render = () => {
    const query = normalize(input?.value);
    const items = data.filter((item) => (active === "all" || item.type === active) && matchesQuery(item, query));
    grid.innerHTML = items.length
      ? items.map((item) => `
          <article class="data-card">
            <span class="tag">${TYPE_LABELS[item.type] || item.type}</span>
            <strong>${item.name}</strong>
            <p>${item.purpose}</p>
            <div class="materials">${item.materials.map((material) => `<span>${material}</span>`).join("")}</div>
            <small>前置蓝图：${item.blueprint}</small>
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
  const data = await loadData("updates");
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
  const data = await loadData("map-points");
  let active = "all";

  const renderDetail = (item) => {
    detail.innerHTML = `
      <strong>${item.name}</strong>
      <span>${TYPE_LABELS[item.type] || item.type} · ${item.area}</span>
      <span>${item.note}</span>
      <a class="inline-map-link" href="${item.link}">查看相关页面</a>
    `;
  };

  const render = () => {
    const query = normalize(input?.value);
    const items = data.filter((item) => (active === "all" || item.type === active) && matchesQuery(item, query));
    pointsLayer.innerHTML = items.map((item) => `
      <button
        class="map-point"
        type="button"
        data-type="${item.type}"
        style="left: ${item.x}%; top: ${item.y}%"
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
