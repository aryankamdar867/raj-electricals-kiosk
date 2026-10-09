const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lwzrcimmtmirijbqxcce.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3enJjaW1tdG1pcmlqYnF4Y2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NzA0NzMsImV4cCI6MjA5NzM0NjQ3M30.6FPNIfPxqDFfGQCrJCYs2iwqOy3rzL0Pwl_AlA0aKfM";

const supabase = createClient(url, key);

// ==========================================
// DOCUMENT 1: MAIN MATRIX FINISHES
// ==========================================
const doc1Finishes = [
  "Charcoal Grey", "Charcoal Grey + Ice Black", "Charcoal Grey + Pearl / Sonic", 
  "Black + Grey", "Black + Ice Black", "Black + Pearl / Sonic", 
  "Nex Gen White", "Allzy White", "Mylinc White", "Allzy Black"
];

const doc1Data = [
  ["6A SWITCH", [204, 204, 204, 60, 60, 60, 166, 56, 114, 60]],
  ["6A SOCKET", [338, 338, 338, 238, 238, 238, 296, 198, 328, 238]],
  ["16A SWITCH", [580, 580, 580, 228, 228, 228, 498, 196, 350, 228]],
  ["16A SOCKET", [742, 742, 742, 322, 322, 322, 630, 284, 502, 322]],
  ["2 WAY SWITCH", [344, 344, 344, 142, 142, 142, 312, 126, 234, 142]],
  ["1M BELL PUSH", [514, 514, 514, 172, 172, 172, 454, 125, 320, 172]],
  ["2M BELL PUSH", [706, 706, 706, 264, 264, 264, 614, 230, 480, 264]],
  ["1M FAN REGULATOR", [1620, 1620, 1620, 710, 710, 710, 1428, 612, 858, 710]],
  ["2M FAN REGULATOR", [1788, 1788, 1788, 806, 806, 806, 1540, 708, 1146, 806]],
  ["T V SOCKET", [384, 384, 384, 166, 166, 166, 320, 144, 286, 166]],
  ["TELEPHONE SOCKET", [368, 368, 368, 178, 178, 178, 316, 150, 268, 178]],
  ["CAT 6 SOCKET", [1125, 1125, 1125, 926, 926, 926, 980, 788, 883, 926]],
  ["INDICATOR", [226, 226, 226, 226, 226, 226, 226, 210, 352, 226]],
  ["BLANK PLATE", [72, 72, 72, 42, 42, 42, 66, 36, 70, 42]],
  ["USB TYPE A SOCKET", [4074, 4074, 4074, 2840, 2840, 2840, 3630, 3630, 1524, 2840]],
  ["USB TYPE C SOCKET", [4074, 4074, 4074, 2840, 2840, 2840, 3630, 3630, 3328, 2840]],
  ["32A DP SWITCH", [1576, 1576, 1576, 450, 450, 450, 1368, 392, 794, 450]],
  ["KEY TAG", [6854, 6854, 6854, 1076, 1076, 1076, 5690, 952, 5140, 1076]],
  ["FOOT LIGHT", [1380, 1380, 1380, 576, 576, 576, 1206, 504, 1126, 576]],
  ["1M PLATE", [320, 376, 512, 320, 376, 512, 264, 156, 202, 198]],
  ["2M PLATE", [334, 396, 542, 334, 396, 542, 276, 156, 202, 198]],
  ["3M PLATE", [362, 422, 576, 362, 422, 576, 290, 220, 276, 260]],
  ["4M PLATE", [388, 450, 624, 388, 450, 624, 324, 232, 304, 298]],
  ["6M PLATE", [694, 816, 1114, 694, 816, 1114, 560, 318, 380, 406]],
  ["8M H PLATE", [756, 890, 1216, 756, 890, 1216, 614, 388, 486, 446]],
  ["8M SQ PLATE", [960, 1114, 1524, 960, 1114, 1524, 780, 388, 496, 446]],
  ["9M PLATE", [1032, 0, 0, 1032, 0, 0, 824, 450, 582, 538]],
  ["12M PLATE", [1154, 1354, 1844, 1154, 1354, 1844, 936, 558, 714, 650]],
  ["16M PLATE", [1438, 1672, 2278, 1438, 1672, 2278, 1180, 596, 834, 742]],
  ["18M PLATE", [1536, 1808, 2468, 1536, 1808, 2468, 1248, 638, 1114, 788]]
];

// ==========================================
// DOCUMENT 2: ANCHOR WHITE
// ==========================================
const doc2Finishes = [
  "Zen White", "Penta White", "Gina White", "Ziva White", "Roma White", "Ziva Chrom White"
];

const doc2Data = [
  ["6A SWITCH", [26, 18, 18, 13, 35, 13]],
  ["6A SOCKET", [150, 150, 150, 69, 188, 69]],
  ["16A SWITCH IND", [178, 154, 154, 106, 262, 106]],
  ["16A SOCKET", [239, 239, 239, 162, 341, 162]],
  ["2 WAY SWITCH", [144, 113, 113, 77, 199, 77]],
  ["1M BELL PUSH", [157, 119, 119, 78, 207, 78]],
  ["2M BELL PUSH", [210, 166, 166, 112, 220, 112]],
  ["1M FAN REGULATOR", [452, 452, 452, 344, 472, 344]],
  ["2M FAN REGULATOR", [536, 536, 536, 396, 659, 396]],
  ["T V SOCKET", [157, 157, 157, 106, 224, 106]],
  ["TELEPHONE SOCKET", [165, 165, 165, 128, 224, 128]],
  ["CAT 6 SOCKET", [958, 958, 958, 668, 926, 668]],
  ["INDICATOR", [132, 132, 132, 87, 157, 87]],
  ["BLANK PLATE", [37, 37, 37, 22, 50, 22]],
  ["USB TYPE A SOCKET", [1769, 1769, 1769, 1161, 1628, 1161]],
  ["USB TYPE C SOCKET", [1769, 1769, 1769, 0, 1909, 0]],
  ["32A DP SWITCH", [287, 287, 287, 230, 434, 230]],
  ["KEY TAG", [1310, 1310, 1310, 578, 1245, 578]],
  ["FOOT LIGHT", [892, 892, 892, 516, 794, 516]],
  ["1M PLATE", [133, 118, 133, 78, 162, 94]],
  ["2M PLATE", [133, 118, 133, 78, 162, 94]],
  ["3M PLATE", [194, 166, 194, 88, 189, 105]],
  ["4M PLATE", [206, 183, 206, 111, 231, 132]],
  ["6M PLATE", [313, 266, 313, 144, 334, 176]],
  ["8M H PLATE", [403, 349, 403, 195, 402, 233]],
  ["8M SQ PLATE", [403, 349, 403, 195, 402, 233]],
  ["9M PLATE", [0, 0, 0, 0, 470, 0]],
  ["12M PLATE", [486, 417, 486, 240, 529, 292]],
  ["16M PLATE", [511, 444, 511, 270, 600, 324]],
  ["18M PLATE", [549, 468, 549, 290, 658, 348]]
];

// ==========================================
// DOCUMENT 3: ANCHOR COLOUR
// ==========================================
const doc3Finishes = [
  "Zen Grey", "Gina Grey", "Ziva Black", "Roma Black"
];

const doc3Data = [
  ["6A SWITCH", [32, 24, 20, 48]],
  ["6A SOCKET", [189, 189, 92, 213]],
  ["16A SWITCH IND", [227, 201, 139, 297]],
  ["16A SOCKET", [315, 315, 214, 385]],
  ["2 WAY SWITCH", [169, 147, 102, 227]],
  ["1M BELL PUSH", [171, 149, 103, 230]],
  ["2M BELL PUSH", [243, 215, 147, 253]],
  ["1M FAN REGULATOR", [603, 603, 453, 537]],
  ["2M FAN REGULATOR", [700, 700, 524, 748]],
  ["T V SOCKET", [197, 197, 140, 249]],
  ["TELEPHONE SOCKET", [210, 210, 171, 246]],
  ["CAT 6 SOCKET", [1217, 1217, 879, 1036]],
  ["INDICATOR", [165, 165, 116, 179]],
  ["BLANK PLATE", [49, 49, 29, 57]],
  ["USB TYPE A SOCKET", [1763, 1763, 1530, 1801]],
  ["USB TYPE C SOCKET", [2052, 2052, 0, 2265]],
  ["32A DP SWITCH", [398, 364, 304, 499]],
  ["KEY TAG", [1660, 1660, 896, 1385]],
  ["FOOT LIGHT", [1140, 1140, 679, 892]],
  ["1M PLATE", [184, 184, 128, 185]],
  ["2M PLATE", [184, 184, 128, 185]],
  ["3M PLATE", [253, 253, 145, 236]],
  ["4M PLATE", [281, 281, 180, 276]],
  ["6M PLATE", [418, 418, 242, 374]],
  ["8M H PLATE", [542, 542, 321, 480]],
  ["8M SQ PLATE", [542, 542, 321, 480]],
  ["9M PLATE", [0, 0, 0, 508]],
  ["12M PLATE", [664, 664, 397, 590]],
  ["16M PLATE", [699, 699, 445, 665]],
  ["18M PLATE", [739, 739, 476, 711]]
];

// GLASS PLATE ITEMS
const glassPlateData = [
  ["1M PLATE", 372],
  ["2M PLATE", 372],
  ["3M PLATE", 517],
  ["4M PLATE", 573],
  ["6M PLATE", 828],
  ["8M H PLATE", 1076],
  ["8M SQ PLATE", 1076],
  ["12M PLATE", 1284],
  ["16M PLATE", 1372],
  ["18M PLATE", 1504]
];

async function updateCatalog() {
  const payload = [];

  // Helper to push items
  const pushItems = (dataset, finishesList) => {
    for (const [itemName, prices] of dataset) {
      prices.forEach((price, idx) => {
        if (price > 0) {
          payload.push({
            name: itemName,
            finish: finishesList[idx],
            price: price
          });
        }
      });
    }
  };

  pushItems(doc1Data, doc1Finishes);
  pushItems(doc2Data, doc2Finishes);
  pushItems(doc3Data, doc3Finishes);

  glassPlateData.forEach(([itemName, price]) => {
    payload.push({
      name: itemName,
      finish: "Glass Plate",
      price: price
    });
    payload.push({
      name: itemName,
      finish: "Glass",
      price: price
    });
  });

  console.log(`🔄 Total items to insert: ${payload.length}`);

  // Delete old rows first
  const { error: delErr } = await supabase.from('products').delete().neq('id', 0);
  if (delErr) {
    console.log("⚠️ Delete note:", delErr.message);
  } else {
    console.log("🗑️ Existing products cleared.");
  }

  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < payload.length; i += batchSize) {
    const batch = payload.slice(i, i + batchSize);
    const { error: insErr } = await supabase.from('products').insert(batch);
    if (insErr) {
      console.error(`❌ Batch ${i / batchSize + 1} insert failed:`, insErr.message);
    } else {
      console.log(`✅ Batch ${i / batchSize + 1} (${batch.length} items) inserted successfully.`);
    }
  }

  console.log("🎉 All updated product prices uploaded to Supabase!");
}

updateCatalog().catch(err => console.error("Fatal exception:", err));
