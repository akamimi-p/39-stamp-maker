const characters = [
  { name: "春日未来", file: "2025-01-05 064854(9).png" },
  { name: "最上静香", file: "2025-01-05 064854(7).png" },
  { name: "伊吹翼", file: "2025-01-05 064854(14).png" },
  { name: "田中琴葉", file: "2025-01-05 064853(2).png" },
  { name: "島原エレナ", file: "2025-01-05 064853(9).png" },
  { name: "佐竹美奈子", file: "2025-01-05 064853(8).png" },
  { name: "所恵美", file: "2025-01-05 064853(11).png" },
  { name: "徳川まつり", file: "2025-01-05 064853(7).png" },
  { name: "箱崎星梨花", file: "2025-01-05 064854.png" },
  { name: "野々原茜", file: "2025-01-05 064852(3).png" },
  { name: "望月杏奈", file: "2025-01-05 064854(15).png" },
  { name: "ロコ", file: "2025-01-05 064853(4).png" },
  { name: "七尾百合子", file: "2025-01-05 064854(5).png" },
  { name: "高山紗代子", file: "2025-01-05 064854(12).png" },
  { name: "松田亜利沙", file: "2025-01-05 064853(6).png" },
  { name: "高坂海美", file: "2025-01-05 064853(3).png" },
  { name: "中谷育", file: "2025-01-05 064852(5).png" },
  { name: "天空橋朋花", file: "2025-01-05 064854(13).png" },
  { name: "エミリー", file: "2025-01-05 064854(10).png" },
  { name: "北沢志保", file: "2025-01-05 064853(12).png" },
  { name: "舞浜歩", file: "2025-01-05 064853(10).png" },
  { name: "木下ひなた", file: "2025-01-05 064854(3).png" },
  { name: "矢吹可奈", file: "2025-01-05 064853(14).png" },
  { name: "横山奈緒", file: "2025-01-05 064853(1).png" },
  { name: "二階堂千鶴", file: "2025-01-05 064854(6).png" },
  { name: "馬場このみ", file: "2025-01-05 064852(1).png" },
  { name: "大神環", file: "2025-01-05 064852(6).png" },
  { name: "豊川風花", file: "2025-01-05 064855.png" },
  { name: "宮尾美也", file: "2025-01-05 064854(2).png" },
  { name: "福田のり子", file: "2025-01-05 064853(5).png" },
  { name: "真壁瑞希", file: "2025-01-05 064853.png" },
  { name: "篠宮可憐", file: "2025-01-05 064854(11).png" },
  { name: "百瀬莉緒", file: "2025-01-05 064852(4).png" },
  { name: "永吉昴", file: "2025-01-05 064854(1).png" },
  { name: "北上麗花", file: "2025-01-05 064852.png" },
  { name: "周防桃子", file: "2025-01-05 064852(2).png" },
  { name: "ジュリア", file: "2025-01-05 064854(4).png" },
  { name: "白石紬", file: "2025-01-05 064854(8).png" },
  { name: "桜守歌織", file: "2025-01-05 064853(13).png" },
];

const characterFiles = characters.map((character) => character.file);
const canvas = document.querySelector("#stickerCanvas");
const ctx = canvas.getContext("2d");
const characterGrid = document.querySelector("#characterGrid");
const characterCount = document.querySelector("#characterCount");
const captionInput = document.querySelector("#captionInput");
const textColor = document.querySelector("#textColor");
const strokeColor = document.querySelector("#strokeColor");
const fontSize = document.querySelector("#fontSize");
const letterSpacing = document.querySelector("#letterSpacing");
const textRotation = document.querySelector("#textRotation");
const textX = document.querySelector("#textX");
const textY = document.querySelector("#textY");
const curvedText = document.querySelector("#curvedText");
const imageScale = document.querySelector("#imageScale");
const imageOutline = document.querySelector("#imageOutline");
const copyBtn = document.querySelector("#copyBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const resetBtn = document.querySelector("#resetBtn");
const centerBtn = document.querySelector("#centerBtn");

const state = {
  selected: 0,
  imageX: 480,
  imageY: 570,
  textX: 480,
  textY: 255,
  dragging: null,
};

const images = characterFiles.map((file) => {
  const image = new Image();
  const item = { file, image, crop: null, thumb: null };
  const handleLoad = () => {
    item.crop = getAlphaBounds(image);
    item.thumb = makeThumbnail(image, item.crop);
    updateThumbnail(item);
    draw();
  };
  image.onload = handleLoad;
  image.src = `public/characters/${encodeURIComponent(file)}`;
  if (image.complete && image.naturalWidth > 0) {
    handleLoad();
  }
  return item;
});

function initCharacterGrid() {
  characterCount.textContent = `${characters.length} 张`;

  characterFiles.forEach((file, index) => {
    const { name } = characters[index];
    const button = document.createElement("button");
    button.className = "character-card";
    button.type = "button";
    button.title = name;
    button.setAttribute("aria-label", `选择 ${name}`);
    button.setAttribute("aria-pressed", String(index === state.selected));

    const img = document.createElement("img");
    img.alt = "";
    images[index].thumbElement = img;
    img.src = images[index].thumb || `public/characters/${encodeURIComponent(file)}`;
    button.append(img);

    button.addEventListener("click", () => {
      state.selected = index;
      syncCharacterButtons();
      draw();
    });

    characterGrid.append(button);
  });
}

function syncCharacterButtons() {
  [...characterGrid.children].forEach((button, index) => {
    button.setAttribute("aria-pressed", String(index === state.selected));
  });
}

function resetLayout() {
  state.imageX = 480;
  state.imageY = 565;
  state.textX = 480;
  state.textY = 255;
  imageScale.value = "126";
  imageOutline.value = "26";
  fontSize.value = "158";
  letterSpacing.value = "2";
  textRotation.value = "0";
  textColor.value = "#4b2a1b";
  textX.value = String(state.textX);
  textY.value = String(state.textY);
  curvedText.checked = false;
  draw();
}

function updateThumbnail(item) {
  if (item.thumbElement && item.thumb) {
    item.thumbElement.src = item.thumb;
  }
}

function getAlphaBounds(image) {
  const scan = document.createElement("canvas");
  scan.width = image.naturalWidth;
  scan.height = image.naturalHeight;
  const scanCtx = scan.getContext("2d");
  scanCtx.drawImage(image, 0, 0);
  const { data } = scanCtx.getImageData(0, 0, scan.width, scan.height);
  let minX = scan.width;
  let minY = scan.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < scan.height; y += 1) {
    for (let x = 0; x < scan.width; x += 1) {
      if (data[(y * scan.width + x) * 4 + 3] > 8) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (minX > maxX || minY > maxY) {
    return { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
  }

  const pad = 18;
  return {
    x: Math.max(0, minX - pad),
    y: Math.max(0, minY - pad),
    width: Math.min(image.naturalWidth, maxX - minX + 1 + pad * 2),
    height: Math.min(image.naturalHeight, maxY - minY + 1 + pad * 2),
  };
}

function makeThumbnail(image, crop) {
  if (!crop) return image.src;
  const thumb = document.createElement("canvas");
  thumb.width = 360;
  thumb.height = 360;
  const thumbCtx = thumb.getContext("2d");
  const scale = Math.min(thumb.width / crop.width, thumb.height / crop.height) * 0.92;
  const width = crop.width * scale;
  const height = crop.height * scale;
  const x = (thumb.width - width) / 2;
  const y = (thumb.height - height) / 2;
  thumbCtx.drawImage(image, crop.x, crop.y, crop.width, crop.height, x, y, width, height);
  return thumb.toDataURL("image/png");
}

function drawOutlinedImage(image, crop, x, y, width, height, outline) {
  if (!image.complete) return;
  const source = crop || { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };

  if (outline > 0) {
    const mask = document.createElement("canvas");
    const pad = outline + 4;
    mask.width = Math.ceil(width + pad * 2);
    mask.height = Math.ceil(height + pad * 2);
    const maskCtx = mask.getContext("2d");

    maskCtx.drawImage(
      image,
      source.x,
      source.y,
      source.width,
      source.height,
      pad,
      pad,
      width,
      height,
    );
    maskCtx.globalCompositeOperation = "source-in";
    maskCtx.fillStyle = "#fff";
    maskCtx.fillRect(0, 0, mask.width, mask.height);

    ctx.save();
    ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
    ctx.shadowBlur = outline * 0.65;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
      const dx = Math.cos(angle) * outline;
      const dy = Math.sin(angle) * outline;
      ctx.drawImage(mask, x - pad + dx, y - pad + dy);
    }
    ctx.restore();
  }

  ctx.drawImage(image, source.x, source.y, source.width, source.height, x, y, width, height);
}

function drawCaption() {
  const lines = captionInput.value.trim().split(/\n/).filter(Boolean);
  if (!lines.length) return;

  const size = Number(fontSize.value);
  const rotation = (Number(textRotation.value) * Math.PI) / 180;

  ctx.save();
  ctx.translate(state.textX, state.textY);
  ctx.rotate(rotation);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.font = `900 ${size}px "Arial Black", "Arial Rounded MT Bold", "Hiragino Maru Gothic ProN", "PingFang SC", sans-serif`;

  const lineHeight = size * 0.95;
  const start = -((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    const y = start + index * lineHeight;
    if (curvedText.checked) {
      drawTextLine(line, 0, y, size, true);
    } else {
      drawTextLine(line, 0, y, size, false);
    }
  });
  ctx.restore();
}

function drawTextLine(text, x, y, size, curved) {
  const spacing = Number(letterSpacing.value);
  const chars = [...text];
  const widths = chars.map((char) => ctx.measureText(char).width + spacing);
  const total = widths.reduce((sum, width) => sum + width, 0) - spacing;
  let cursor = x - total / 2;

  chars.forEach((char, index) => {
    const charWidth = widths[index] - spacing;
    const center = cursor + charWidth / 2;
    const normalized = total > 0 ? (center - x) / total : 0;
    const arcY = curved ? y + Math.pow(normalized, 2) * size * 0.72 : y;
    const arcRotation = curved ? normalized * 0.62 : 0;

    ctx.save();
    ctx.translate(center, arcY);
    ctx.rotate(arcRotation);
    ctx.strokeStyle = "rgba(42, 49, 58, 0.25)";
    ctx.lineWidth = Math.max(18, size * 0.22);
    ctx.strokeText(char, 8, 9);
    ctx.strokeStyle = strokeColor.value;
    ctx.lineWidth = Math.max(15, size * 0.19);
    ctx.strokeText(char, 0, 0);
    ctx.fillStyle = textColor.value;
    ctx.fillText(char, 0, 0);
    ctx.fillText(char, -1.4, 0);
    ctx.fillText(char, 1.4, 0);
    ctx.fillText(char, 0, -1.2);
    ctx.fillText(char, 0, 1.2);
    ctx.restore();

    cursor += widths[index];
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { image, crop } = images[state.selected];
  const scale = Number(imageScale.value) / 100;
  const maxSize = 760 * scale;
  const sourceWidth = crop?.width || image.naturalWidth || 1;
  const sourceHeight = crop?.height || image.naturalHeight || 1;
  const ratio = sourceWidth / sourceHeight;
  const width = ratio >= 1 ? maxSize : maxSize * ratio;
  const height = ratio >= 1 ? maxSize / ratio : maxSize;
  const x = state.imageX - width / 2;
  const y = state.imageY - height / 2;

  drawOutlinedImage(image, crop, x, y, width, height, Number(imageOutline.value));
  drawCaption();
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function beginDrag(event) {
  const point = canvasPoint(event);
  const distanceToText = Math.hypot(point.x - state.textX, point.y - state.textY);
  state.dragging = distanceToText < 190 ? "text" : "image";
  canvas.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  if (!state.dragging) return;
  const point = canvasPoint(event);
  if (state.dragging === "text") {
    state.textX = point.x;
    state.textY = point.y;
    textX.value = String(Math.round(state.textX));
    textY.value = String(Math.round(state.textY));
  } else {
    state.imageX = point.x;
    state.imageY = point.y;
  }
  draw();
}

function endDrag(event) {
  state.dragging = null;
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
}

function downloadSticker() {
  draw();
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "39qq-sticker.png";
  link.click();
}

async function copySticker() {
  draw();
  copyBtn.disabled = true;
  copyBtn.textContent = "复制中";

  const resetCopyButton = (label, delay = 1800) => {
    copyBtn.textContent = label;
    setTimeout(() => {
      copyBtn.disabled = false;
      copyBtn.textContent = "复制";
    }, delay);
  };

  if (!navigator.clipboard || !window.ClipboardItem) {
    downloadSticker();
    resetCopyButton("已下载 PNG", 2200);
    return;
  }

  canvas.toBlob(async (blob) => {
    if (!blob) {
      downloadSticker();
      resetCopyButton("已下载 PNG", 2200);
      return;
    }

    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      resetCopyButton("已复制");
    } catch {
      downloadSticker();
      resetCopyButton("已下载 PNG", 2200);
    }
  }, "image/png");
}

[
  captionInput,
  textColor,
  strokeColor,
  fontSize,
  letterSpacing,
  textRotation,
  curvedText,
  imageScale,
  imageOutline,
].forEach((control) => control.addEventListener("input", draw));

textX.addEventListener("input", () => {
  state.textX = Number(textX.value);
  draw();
});

textY.addEventListener("input", () => {
  state.textY = Number(textY.value);
  draw();
});

copyBtn.addEventListener("click", copySticker);
downloadBtn.addEventListener("click", downloadSticker);
resetBtn.addEventListener("click", resetLayout);
centerBtn.addEventListener("click", () => {
  state.imageX = 480;
  state.imageY = 565;
  draw();
});

canvas.addEventListener("pointerdown", beginDrag);
canvas.addEventListener("pointermove", moveDrag);
canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);

initCharacterGrid();
resetLayout();
