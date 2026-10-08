import os
from supabase import create_client, Client

# Use the exact same credentials from your .env.local file
url = "https://lwzrcimmtmirijbqxcce.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3enJjaW1tdG1pcmlqYnF4Y2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NzA0NzMsImV4cCI6MjA5NzM0NjQ3M30.6FPNIfPxqDFfGQCrJCYs2iwqOy3rzL0Pwl_AlA0aKfM"
supabase: Client = create_client(url, key)

# Parsed matrix from your document
finishes = [
    "Charchol Grey", "Charchol Grey + Ice Black", "Charchol Grey + Pearl/Sonic", 
    "Black + Grey", "Black + Ice Black", "Black + Pearl/Sonic", 
    "Nex Gen White", "Allzy White", "Mylinc White", "Allzy Black"
]

raw_data = [
    ("6A SWITCH", [198, 198, 58, 198, 58, 58, 160, 54, 112, 58]),
    ("6A SOCKET", [318, 318, 226, 318, 226, 226, 278, 188, 310, 226]),
    ("16A SWITCH IND", [544, 544, 220, 544, 220, 220, 468, 190, 336, 220]),
    ("16A SOCKET", [696, 696, 306, 696, 306, 306, 592, 270, 476, 306]),
    ("2 WAY SWITCH", [324, 324, 138, 324, 138, 138, 292, 122, 226, 138]),
    ("1M BELL PUSH", [482, 482, 166, 482, 166, 166, 426, 146, 236, 166]),
    ("2M BELL PUSH", [664, 664, 664, 256, 256, 256, 576, 222, 468, 256]),
    ("1M FAN REGULATOR", [1344, 1344, 660, 1344, 660, 660, 1168, 570, 794, 660]),
    ("2M FAN REGULATOR", [1522, 1522, 750, 1522, 750, 750, 1340, 658, 1062, 750]),
    ("T V SOCKET", [362, 362, 154, 362, 154, 154, 302, 134, 264, 154]),
    ("TELEPHONE SOCKET", [348, 348, 166, 348, 166, 166, 298, 140, 248, 166]),
    ("CAT 6 SOCKET", [1042, 1042, 857, 1042, 857, 857, 907, 729, 818, 857]),
    ("INDICATOR", [210, 210, 210, 210, 210, 210, 626, 190, 326, 210]),
    ("BLANK PLATE", [68, 68, 68, 40, 40, 40, 62, 34, 64, 40]),
    ("USB TYPE A SOCKET", [3826, 3826, 2644, 3826, 2644, 2644, 3408, 2446, 1412, 2644]),
    ("USB TYPE C SOCKET", [3826, 3826, 2644, 3826, 2644, 2644, 3408, 2446, 3084, 2644]),
    ("32A DP SWITCH", [1480, 1480, 410, 1480, 410, 410, 1284, 356, 764, 410]),
    ("KEY TAG", [6434, 6434, 986, 6434, 986, 986, 5690, 995, 4768, 986]),
    ("FOOT LIGHT", [1296, 1296, 536, 1296, 536, 536, 1132, 470, 1044, 536]),
    ("1M PLATE", [300, 352, 480, 300, 352, 480, 248, 144, 186, 184]),
    ("2M PLATE", [314, 372, 314, 508, 372, 508, 258, 144, 186, 184]),
    ("3M PLATE", [340, 396, 340, 540, 396, 540, 272, 204, 254, 242]),
    ("4M PLATE", [364, 422, 364, 584, 422, 584, 304, 216, 282, 278]),
    ("6M PLATE", [650, 766, 650, 1044, 766, 1044, 526, 296, 350, 378]),
    ("8Μ Η PLATE", [708, 834, 708, 1140, 834, 1140, 586, 362, 450, 416]),
    ("8M SQ PLATE", [900, 1044, 900, 1428, 1044, 1428, 732, 362, 458, 416]),
    ("9M PLATE", [966, 0, 966, 0, 0, 0, 774, 420, 538, 502]), # Cleaned 'NA' values to 0
    ("12M PLATE", [1082, 1270, 1082, 1728, 1270, 1728, 878, 520, 660, 606]),
    ("16M PLATE", [1348, 1566, 1348, 2134, 1566, 2134, 1108, 556, 770, 690]),
    ("18M PLATE", [1440, 1694, 1440, 2314, 1694, 2314, 1172, 594, 1030, 734])
]

payload = []
for item_name, prices in raw_data:
    for index, price in enumerate(prices):
        if price > 0: # Skip the items marked as NA/unavailable
            payload.append({
                "name": item_name,
                "finish": finishes[index],
                "price": price
            })

print(f"🔄 Bundling {len(payload)} products for database insertion...")
result = supabase.table("products").insert(payload).execute()
print("🎉 Real product catalog successfully deployed to Supabase!")