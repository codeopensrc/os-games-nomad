## Implement
xBattle system
x- Show damage

xGear system
x- Equip items
x  - Remove from inv
x- Equip screen
x  - Unequip on click, return to inv
x  - Stats on hover
x   - numbers aligned
x   - stats diff color
x  - Show overall stats
x- Show health/attack/def on training for now



Mob/Dungeon system
x- Select mob
x- Mob populates with stats
- figure out dungeon/training exp
~~ - dungeon leads to mob selection
x  5 dungeons x 5 mobs
x  fields
x  cave
x  bandit camp
x  temple
x  graveyard
  shrine
  swamp
  ruins
  mountain
  castle
  colcano
  ice cavern
  forest
  desert

x  5 locations
~  4 mobs + 1 end dungeon, 5 x mobs, 9 per location = 45 mobs

x- consumable
x- potion
x- item trashing
x- save state
x- reset state - delete cookie

x Crafting system
x - from inv? - nope
x - combine   - nope
x - craft screen - done

x Currency/Shop system
x- +5 +20 buttons


xPlots
x- different yields for plot size
x - can go with better drop %, keep bonus fairly static for now
x- % drops for different items / rarity
x - apply to monster drops

xAll items
x- priced
x- statted
x- used

xPlots displaying drops
x- Click again stops

xBetter craft interface
x- +5 +20 buttons to craft interface
x- update "craft max" num when more loot comes in

xDisplay potion buffs in training interface
- Store player buffs serverside
x - How do they expire, do we have a timed duration or on death
x- How to remove/override with diff buffs
x - potion buffs removed when potion unequiped

xRandomize shop items
x- Shop sell items for more markup
- Shop comes from server later
x - When to randomize

xFood/cooking system
~~ - Maybe potion buffs are 10m, food 30m etc.
x- or food purely heal effect

Move to server-side logic
- Will be better for logic adjustments and not having to reload page
- Basic db up storage working
 - (further along) start thinking about changes affect player data and migrations

xKey/Unlock system
x- 3rd/4th fields unlock at X level
x - Dynamic number of fieds - unlocking at increasing skill levels
x- Next zone unlocks after X item obtained
x- Maybe a keychain, use as a soft progress meter
x- Unlock crafts by obtaining/purchasing recipe
x- Maybe shop sells recipes
x - Rarity of certain items appearing in shops
x- Boss with elevated stats + lots of health, meant to be killed good low drop rate loot
x- Unlock skills on char level?
x - Enchanting/disenchanting gear
x  - Making potions powerful but expensive, food being efficient
x - Herbs increase effectiveness/length
x  - optional vs mandatory/interchangeable
x  - Part of "optional"/interchangable reagents task
x  - Click in craft screen to include/change optional/interchangeable ingredients
x     - "optional"/"interchangable" in ingredients
x     - "craftedStats"


xAdjustments
x- Brew speed 2-3x longer
x- First plot xp down to 1-2
x- First plot speed to 5s, 2nd to 8s, 3rd to 11s, 4th 15s, 5th 20s
x- Lower drop rates possibly
x- Items crafted, fragments dropped from mobs, higher drop, need multiple fragments
x - cow hoof, bear claw, boar tusk, vulture beak, farmhand pitchfork fragment, farmer pitchfork fragment etc
x - Need weapon crafting/recipes using mob items
x- 1 root per potion, root comes from first foraging
x- Unlock herb then 1 ginger for stronger version etc

xLevel affects yield
x- +0.5% yield of item per lvl - 5% improved yield per 10 lvls
x - if 40%, 2% per 10 levels
x - if 20%, 1% per 10 levels
x - if 70%, 3.5% per 10 levels

xStats on craft screen/hover same as inv

xBetter craft and barter buttons

xImplement recipe unlocks/drops
x- Default very simple/basic items
x- Recipe can have multiple unlocks

xIf item no longer exists in catalog, return safely and delete

xAdd enchanting to weapons/gear
x- disenchanting
x- enchanting
x- clearly display enchanted stats/dont just add into item
x- preserve stats through save/load
x- preserve on equip/unequip

xFood system
x- craft food
x- equip food
x- food displayed in training interface
x- eat/autoeat food on %/threshold

xMain icons on leftmenu

xDisplay slot on item hover
x- including enchant/craft interface

xDisplay monster loottable somewhere

xPlot per item, not mixed
x- high drop rate, but individual harvest times
x- increase chance for multiple drops/ensure 1+
x  - level affects extra loot?

xBuffs/Potion effects on
x- death
x- timer

xImplement global timer
x- time passed since timer does action like shop refresh
x- potion buffs
x - Maybe potion buffs are 10m, food 30m etc.
x- Do not reset health on stop
x - Player regens 1 health every 5sec (out of combat)
x- Maybe make food usable either in Inv or Training
x- Time until shop refresh displayed
x- potion buffs persist through reload
x - Reload potion buffs

xBuying from shop when cant afford still removes items from shop
x- Dont reduce if cant afford
~~ - Maybe check if we can afford and cap amount at max
x- Little error in barter window indicating insufficient amount
- Fix xNUM in recent activity popup on purchase
 - Only sum items - carrot is one

xStop attacking/escaping costs health
x- If under threshhold, cannot escape

xPrayers/Blessings
x- Blessings last until death
- Can be for stats or also gathering/crafting, like increase yield, chance for multi etc
x- Limit 1
x- Display buffs/prayer buffs in training
x - spruce it up
x- Prayer stays on Player but does not reapply on reload
x- Potions not staying anymore
x- Potion applying being wonky

xSave current enemy for reload

xToggle between mob loottable and current equipment
x- rightmenu mainly informational
x- switch between mob loottable (if in training) and inv
x- otherwise show inv (unless in inv, dunno there)

xBury bones display prayer exp in recent

xTooltip on mob loot

xRecipes display what it teaches

Death consequences
x- minus 5% silver?
- gear durability goes down - later once durability implemented

Fix shop item tooltips
xGear/Item stats/functions reusable
x- Used in ~inv, ~shop, ~craft, ~training, ~rightMenu
x- Inv/RightMenu have most up to date
- ExtraMenu/Barter component
  - Inv/Craft/Shop uses

xCrafting now needing level
x- Dont think we implement recipe needing level to learn

xEnchanting increases enchanting exp

xPraying probably should resetactivity

xFlasks
x- Potions that last long and persist through death
x- Multiple rows of buffs for flask/mix etc

xAdd admin tool to add items

xScrolls
x- Long minor buffs lost on death
x- Dye, ink

xTimer idea
x- Clocks are timers in seconds
x- Every second remove 1 second from all timers
x- TimeApplied to buffs then loop through buffs?

xSpd stat in enchant as % like buff/scrolls/potions

xDifferent buff sources give different +X colors

xSword enchant duplicated

xType of weapon affects attack speed

xAttack speed buff

xAttack and attack speed prayer

xBuffs on inv/stat/side panel like training
x- including atk speed
x- fix equipment on rightmenu

xEquipping/unequipping weapon causes speed to bug out with buffs
xUnequpping weapon should revert to default speed
xMaybe right click buff to remove, but maybe not
x- Yes, at least good for testing and cannot remove scroll buffs

xHow to determine effects of craft on gear

xAdd socket
xGem 1st slot
xAdd second slot
x - Add but cannot save
x socketedStats also may break

xSocket/gem saving on inv works but not gear

xFilter inventory - All, Gear, Materials

xAdmin remove specified item

xWhen attacking and burying - shows prayer as active skill and exp on kill
x- Also gives exp to prayer on kill

xRarity of items appearing in shop
x- Do we sell recipes

x"Attack" from gear not factored into final attack power

xSwap req skill and not enough mats highlighting in recipe list

Gems/Jewels/Socketing
x- Ring + Amulet slot
x - rightmenu
~- Random find from mining
x - Or prospected from raw ore
~- Must be cut
x- Maybe make a craftable "socketing" item to apply to gear
x  - Random color on apply
- health gem "prismatic", matches any socket
  - regen/health 1 will be "prismatic", atm need 1 yellow
x - Diff color gems match multiple diff sockets
x   - This maybe later with mixed gems
x  - Matching gives tiny bonus
x- Multiple varying slots

xcraftOptions vs craftEnhancement ?
x- gear mandatory vs potion enchancement
xOptions mandatory 1
xEnhancement optionally enhances craft

xkeep norm + each crafted enhancement counterpart separate
x- vanilla vs duration vs potency potions to start
x- when finding in inv
x- potent stats stuck
x- bonuses not appearing in buff stats

x!crafted stat does not get reduced/goes up on reequip cycle
x- crafted goes up on equip
x- if equiped, does not add crafted stats now

x!Current health didnt update when remove health socket
x- Not sure if also bonus
x- can only socket unequipped, issue with unequipping gear with health

x!potions being added on equip, not just the buff from "drinking"

x!item.sockets undefined when selecting gem in crafting interface
x- not weapon so most likely ring/neck issue

x!selectedOptionalItem is undefined when crafting regular items
x- not enchanting or prayer

x!Bury changes active skill to prayer and gathering gives it xp

x!Continous crafting using optional/enhance materials not checked atm

xBury multiples

xRight click on gear also has equip option

xMaybe dynamic socket bonus. if more than half sockets blue, bonus def, red str, green health
x- default for each slot if 1/2 or 1/3 is most

xIndicate stats gained on craft page hovering over craftedIcon

xMaterials make elixirs
x- different tier elixers are the enhancement per potion/flask
x- Potent elixir, Lingering elixir

xMixed gems
x- Def + Main stat = Blue + red = purple
x- Matches red and blue slots
x- Get multiple sockets working
x  - When socketing gem, pick from "Socket 1st socket, 2nd socket, 3rd socket"
x- Address how later socket bonues like health wont scale too well depending
x - +1 atk/def and +20 health not amazing later. Maybe bonus based on 'ilvl' like affixes
x   - ie. piece of gear give 5 stats, +1 - +2, 10 stats +2 - +3 etc
x- 2nd/3rd socket exponential cost
x - gives sockets with multiple sockets from found gear more value
x - 1st slot 1x, 2nd slot 5x, 3rd slot 10x

x!Stats widget stopped working in rightmenu

xError/Notif popup
x- Cant equip an item
x- Died
x- Not enough money to purchase
x- Finished crafting
x- Maybe level up

x!Flask not stacking in activityPopup

xGear affixes
x- +% dmg/def/stat
x- +flat dmg/def/stat
~ - Create ilvl pools based on cumulative stats of item
~ - ie. piece of gear give 5 stats, +1 - +2, 10 stats +2 - +3 etc
x- 1-3 affixes based on rarity
x- Item to reroll stats
x- Item to reroll sockets
~- Item to reroll rarity
x - all VERY rare and expensive
x- Show in gearStats
x- Save affixes
x- Random rarity in drops
x- Rarity color of item in equipslot
x- Double check affix bonus applies pre-enchant/socket/bonus BUT post craft
x - affixes come pre-enchant/socket/bonus but also pre-craft
x - have to move craftWithMats higher up the chain
x  - moved apply after craft
x- Change gearStats border to rarity color as well
x- Crafted vs dropped vs sold affixes

x!Purchasing item with affix does not transfer

x!allowedAffixes undefined when clicking dungeon
x- error when creating NPCs

xRarity tweaks
x- Increase price based on rarity
x - Selling also should increase price
x- Disenchant more based on rarity
x- Rarity show in enchanting/socket interface
x- Rarity show in RecentActivity

xChance to get sockets on item, rarity affecting the chance

xAdjust socket/gem values

xGambling shop
~- Once enchanting, gamble for items that may or may not have random enchants
x- Maybe add ring/amulets/Jewelcrafting
x- Add gear affixes, 1 affix 90%, 2 affix 8%, 3 affix 2% etc

xUnstackable items/gear in shop just have "Buy/Sell", not adjustable num

xUnequip stopping gathering, should not

xReduce/halve gathering times

xWorld buffs
x- Weekend buffs
x- Hourly buffs
x - worldbuff affix for buff
x - show on inv

xTiny icon for each dungeon
x- Maybe slight dungeon makeover
x- Dark/hooded/shaded figure as player - like a prophet
x- Default/fallback black/shaded/scary looking monster sprite for enemy

Fix food css/placement on Training
x- Also hitIcon
x- Maybe place swingtimer right below sprites
x- floating text cooler, like active translate/fade
~- ideally "heal" just like "hit"
- skull/death icon on kill/death
~- if blocked, show shield image instead of slash

xBetter background art ~ basic
x- Inv bag
x- Equipment bg slots
x- Crafting interface
~  - book themed (recipes/pages)
x- Gamble button
x- Shop screens
x- Training revamp later

xTool slot

~Tool requirements for higher gathering
x- Later increases yield
x- Now with atk speed logic, gather speed can be increased
x- Rank 1 tool +5%, Rank 2 +10%, Rank 3 +15% etc

xToolbelt/Keyring
x- Belt for gathering speed (loot yield later when implemented stat)
x- Key ring to enter harder/unique dungeons
x - Key ring implemented for zones
x - Next "dungeons"
x- display toolbelt
x- stats displays tool stats
x- display currently equipped tool in appropriate skill interface
~- skills display tier tool required if any
~ - maybe only certain specialty items req tool
x- tools for craft skills
x - implement chance for additional item from crafting

xHave popupinfo be an array
x- If multiple actions/items, multiple popups
x - Finished craftig/level up good example

xEnchanting/Jewelcrafting/Prayer tools
x- Inc yield from disenchant/prospect
x- Only xp gain really applies to prayer

xExp/yield buff
x- exp (tool and non-tool)
x - tool
x - non-tool
x- yield (tool done, non-tool)
x - tool
~ - non-tool
~  - would interfere with mob drop rates


xDungeon layout
x- 5 higher health "elite" mobs with ultra high health boss
x - "elite" border/indicator for dungeons mobs
x- Loot at end
x  - Larger loot pool overall, gear only drops from dungeons
x  - Random sockets/gear affixes
x    - reason to implement gear affixes/rarity of item
x- Choice to auto-repeat
x- Drop silver from dungeons
x  - Visible loot/Recentactivity
x- High drop chance loot
x - Min amount now drops
x - Min num rarity drops
x- Highly valuable loot to sell
x- Limit total looted from pool?
~  - Rarer items roll first
~  - Go down list until limit reached then give

xdie() function on player to reset things for npcs


xTooltip move based on row in shop like inv
x- Do for gamble items too

xFilter in shop like inv
x- css/itemContainer

xRefresh worldbuff, not remove+reapply ideally

xCraft page, better filtering/listing of recipes
x- inscription, prayer, alchemy
x- smithing - tools
x- if food, no category
x- enchanting/woodenrod

~Multi-sell/disenchant
~- Click bulk sell
~ - Maybe even bulk disenchant
~- Each item gets a checkbox
~- Click confirm bulk sell to sell all checked items

=====

xQuick sell/disenchant
x- Toggle quick sell
x- Quick sell
x- Toggle quick disenchant
x- Quick disenchant
x- Only when Gear filtered

xSwitch to localstorage for now before server

xAdjust all stat values, health in lower mobs mainly



#Dungeon Balancing
Still considering this
Max food/potions per slot
- Prevents going into dungeon with tons of low quality consumes
- Maybe cooldowns on potions/food usage instead
 - Food 10 second cd?
 - Potion no cd before battle, 25 second cd in battle?



Game balance from scratch
=== ~2 days playing
26 farming, 7 forestry, 23 foraging, 48 mining, 8 alch, 5 smithing, 17 cooking, 16 enchanting, 10 prayer, 15 inscript, 30 jewelcrafting
Full tin - Epic helm/boots/wep/neck (crazy rng). Rare chest/ring
52 atk, 34 def, 298 health, 18 str, 2.5 spd
Clears 2nd dungeon with 5ish pumpkin soup and world buffs, 7+ without world buffs, subsequent runs (half health) 10+ soup


##### General item/gameplay balance
---- Didnt like selling start looted items and gambling being first gear items
----   due to lack of recipes
---- Ideas/fixes
----  x- Doubled gambling prices
----  x- Increase recipe drops in some manner
----  ~- Default few new starter recipes. stone/bone/leather
----  x- Provided intro recipes to get started

x- Review shop
x- Add certain default items every shop refresh
x - Basic food always stocked in shop
x - 3-5 starter food for example
x- Define junk/sell items as "junk"/grey
x - Indicates not used in any recipes
x- Check if has recipe before dropping???
~ - Reroll if recipe already learned
x - Normal mobs just dont add and dont add to mob table in dungeon
x- Only carrot soup?
x- Cooking first mob or 2
x- Cooking vol2 later and less on levels?
~- All mobs have shared recipe loot pool/chance?
x - Split pretty evenly amongs all mobs
x - Fields tier 1 recipes
x - Cave tier 2 recipes
x - Bandits tier 3 recipes
x- Up drop rates of early recipes?
x - Better to just gamble each piece initially
x - Crafted stats/rarity chance would make better
x  - Upped rarity chance, slowly adding crafted stats to gear
x- Obv add all items to recipes
~ - Single item recipes?
~ - Possible still but atm no
x- Sockets, 1 4 9 -> 1 3 7 cost
x- Maybe scale up food health
x- Healing potion heals for way more
x - 3-4x food
x- Allow refreshing with ~1 minute left like worldbuff
?- Maybe inv cap, craft bag for more bag slots
? - Could be tailoring
?- Way later, organize bags/slots
x- Adjust crystal sell price
x - 50-40% of current
~ - slightly nerf drop rates
x- Need more raw health/health bonuses, still feels weak
x- Selecting mob shouldnt stop crafting/gathering, only on start attack
x - Have to force run/stop without reset
x- Bones should sell for more than carrots
x- Scrolls 5m buff
x- # seconds/tier items all sell for same price
x- Pay X/X% silver to full heal somewhere?
x- Reroll stats/sockets in enchanting for 5x all 5/6 gem types and end of dungeon reward
~- Boon worldbuffs
~ - WoW style booning
~- Defense rework. Should not negate damage based on damage - defense
~ - Defense should be % based, can work with 100 def being "max" capping at 80% reduc
~   then rework later when introducing something like levels
~ - Damage overall will have to be lowered and health probably increased
x - Low/High end ranging defense value with minimum dmg per attack for now
## Econ
x- Gamble 2x
x- Less/proper silver from dungeons
x- General rebalancing of gear value
x- Crafted items sell price should reflect ingredients sell price + 10-20% markup
x - ie. 1 carrot sells for 2c, carrot soup takes 3 carrots, carrot soup sells for 7
x - Comes after ingredient revamp
x- Higher mobs loot sell for more


##### Dungeon
x- Dungeons probably drop some combination of mob-specific items
x - Sep from gear loot pool somehow
x- Nerf rarity chance from dungeon very slightly
x- Runes end of dungeon for crafting
x- Mobs base stats increased
x - Elites/Bosses lowered
x - Slight tweaking, 75%+ more health, 10-20% more dmg/defense
x - Lowered elite/bos atk/def 10% and health 20%
x- 1-2 items end of dungeon
x - 2-3 lil too much gear inflation
x - ~10% chance for 2
## Balance related
x- Reevauluate stats going into cave
x - Able to completely bypass cave mobs, kill end guy for key
x - Killed eerie caverns twice with full buffs and 20x pumpkin
x  - No def potion or prayer but had world buffs

##### Crafting
x- Obvious ingredients overhaul
x- Buff rarity chance from crafted items
x- Craft time 3s/5s?
~~~~~ - Play with idea ingredients take longer, recipes costs more, no craft time
x- All soups same num?
x - Lower tomato to 3
~- Crafted stats equal or slighly better than dungeon?
x - Reg craft stay slightly worse as dungeon drop enhancements make them better and enhanced crafted increases rarity rolls
x - Extra crafted stats + enhanced affix rolls from dungeon drop "runes" + 1 socket guarentee + increased rarity
x - "Runeforged"? crafted items
x- Reduce mats for crafting gear
x - At the moment dungeon spam just too good
~ - Crafting needed for crafting enhancements
x  - Or dungeon loot needed (Orbs/artifacts/etc)
x - Implement craft enhancements for gear now
x - Craft affixes change to "enhanced" affixes with dungeon item drop?
x  - "Runeforged"
x  - Slightly better than dungeon drop
x   - 1 tier of affixes higher currently, maybe 1/2 tier higher if too much
x - Crafted gear higher chance for socket?
x  - Always min 1 socket?
x- Stat potions more exp and higher ingredient cost
x - Healing potion more exp slight cost increase
x- Change inscription ingredients
x- Farmhand cloth on chest only
x- Smelting/bronze bars in smithing
x- Maple for tin tools/shafts
x- Scroll maybe alch lvl 3
## Exp related
x- Exp from crafting overhaul
x - alchemy
x - smithing
x - cooking
x - enchanting
x - prayer
x - inscription
x - jewelcrafting
x- Alch xp maybe too low
x- Adjust enchanting levels 
x- Prospecting slightly less exp
x- Cooking exp scale up
x - Pumpkin 2-3x more into tomato soup
x - Tomato probably 2-3x pumpkin
x- Activating prayer should probably give at least Bone Burying amount in exp
x- Inscription xp high

##### UI
x- Max Inv height 10% smaller
x- Right menu display equipment in shop
x - Helps with comparison while selling
x- Calculate dps in weapon
x - dmg/Speed
x- Affixes, show flat dmg but use/apply % behind scene on item creation
x - This way when base item changes, updates affix values
x- Maybe loot drops appear in middle of screen when on battle?
~ - List of last 10 item drops on bottom
x - List of last 5 instance of mob/dungeon dropping items on bottom
x- All scrolls in inv show somewhere in battle?
x- Recipe list start expanded
~- Save state of filters for gear/shop?
~ - Same with expanded/nonexpanded recipes ideally
x- Additional Inv filters
x- Additional Shop filters
x - Recipes
~ - Maybe good place to show what recipes learned
x  - Learned recipes in right menu craft interface with tools and exp buffs
x - Potions
x - Scrolls
x- Filter slot
x- Filter rarity
x- Shift + hover, compare with equipped
x - Compare raw if possible
x - Maybe shift 1-1 and Ctrl removes enchants/sockets/socketBonus (affixes still inherent)
x - Do for shop now
x- Drop chances in loot table tooltip
x- Hover over mob display list of loot in mob select menu
x - Populates the right mobLootTable on hover
x- Enchanting, show equipped slot first and slightly diff indicating equipped
x - Same with socket/jewelcrafting
x- Exp buffs in crafting rightMenu

#### Bugs
x!Consecutive exp ups not showing from enchant
x!Had to re-equip weapon to reflect new spd from enchant + gems
x - This is because we didnt allow socket/enchant on equipped gear previously
x!When dungeon and reload, only enemy loaded, not dungeon
x!Jewelcrafting/enchanting/prayer should never show as "ActiveSkill"
x - No active gathering/crafting happens with those skills
x - Only temp
x - Think solved for jewel/ench, prayer ez
x!Clear RecentActivity from prospect
x - Gem showed up when enchanting?
x!Recipe Teaches list offcenter for inscription vol1
x!Recipe for prayer shortname gets fucked in item icon
x!Flask doesnt show in gear or potion filter
x - Have to uncheck all to see
x!Random rarity getting assigned to normal items sticks since they have no affixes
x!Fix how speed increase works
x - 95% increased attack speed should not make weapon -95% speed, it should be about half
x - 3.5 spd with 100% increased speed != 0.0 spd. Should be ~ 1.75
x - multiplicative vs additive?
x - 3.5 * .18 = Num   Num * .17 = NewNum1  NewNum1 * .1 = NewNum2  NewNum2 * .08 = NewNum3
x!rune_of_enhancement improvement to affixes is static after craft
x - cannot update enhancements affix %'s when adjusting rune_of_enhancement values and have it reflected in affix %'s
x!craftOptions and craftEnhancements merging in craft interface
x - Separate out mandatory craftOptions vs optional craftEnhancements
x!On dungeon restart, check status of auto restart checkbox
x!def scroll craftime
x!showSlot index offset based off row in inv, not "viewing" row
x - item in inv 10th row, but filtered 1st row, uses 10th row offset
x!categories[categoryPool] undefined in Game.prototype.refreshShop
x - Maybe cause < or > and not <= and >= on ranges which we just updated in rollOneFromDistribution
x!If we buy a recipe we already know, still purchases, have to prevent purchase
x - Review if recipe learned if it still shows in shop (addItems)
x - What do we do with showing/rolls of already learned recipes??
x  - If all recipes learned, do we just forfeit that roll or reroll another item?
x  - I say just prevent purchase - otherwise each time a recipe shows up its one we dont know
x!Rightmenu LootTable in dungeon should only show end of dungeon loot not individual mobs
x!Filters buttons not lined up with quick disenchant
x!With DisplayEnemy resetting mobLooTable, when selecting eney, can empty it out
x - Easy fix is just use 2 different arrays
x!Can endlessly quick disenchant equipped items
x!Ctrl removing craftedStats from Stats.jsx screen
x!misc_rune_1|stat_rune_1 not in catalog
x - Only 1 tier of runes for now
x!runes not showing in dungeon loot table
x - Like a recipe item
x  - Stats page removes "Teaches" but list of runes in that category
x!Rune of rarity kinda random but chance not
x!Crafting with optional + enhance wont craft without enhance selected
x - no enhance selected fine when no optional


###### AGENDA
x- Runes/Orbs/artifacts dropped in dungeons to make crafted items better
x - Crafted stats to crafted gear
x - Enchance crafted items with new drops to be better than raw dungeon drops
x - Enhanced chance for better rarity with enhancement
~~~ - Maybe 2-5% drop rate from disenchanting as well

x- Runes/Orbs/artifacts from dungeon loot to craft into gear
x - Maybe "Rune of Chance" gives random stat while "Rune of Striking" gives atk
x - "Rune of Enhancement" gives X% better affixes
x  - Flat determined stat vs Random stat vs Enhancements to affixes
x  - "Rune of Rarity" increases chance for rare item on craft etc
x   - Simple upgrades rarity of item +1 up to epic

xCtrl shows raw affix stats %

xDefault items in shop
x - Review shop items/chances

xRecipes only drop if unlearned
x- If learned dont add it
x - If on mob works fine but
x- Remove from dungeon loot pool if learned

xWhen crafted - "Runeforged"
x- Maybe label where item came from, at least runeforged be nice
x- When crafting/crafting gear, check for rune/opt ingredients and apply runeforged rarity/affixes

xAll UI improvements

~Runecrafting with enchant+ mats?

xSupport multiple craft ingredients
x- Separate out mandatory craftOptions vs optional craftEnhancements in interface
x- Support multiple selections now
x - At least 1 mandatory and 1 enhancement

xReroll stats/sockets in enchanting for 5x all 5/6 gem types and end of dungeon reward
x- For now, endless reroll allowed, limiting factor is dungeon reward to roll
x- Same with sockets
x- Reroll all item
x - ex. Runeforged epic with 2 sockets
x- Reroll 1 on item
x - ex. Runeforged epic with 2 good affixes

xItem for affix rerolls in recipe

xClicking alert dismisses it

xPay to full heal

xDefense rework

xReview value of all items
x- Raw gathering
x- Misc drops
x- Mob-specific drops
x- Rune
x- Orb
x- Recipe
x- Crafted food
x- Jewelcrafting
x - crystals
x - ring/neck
x- Alchemy
x - Potion
x - Flask
x- Smithing
x - Bars
x - Weapon
x - Gear
x- Inscription
x- Enchanting
x - essence
x - crystal

xlight_hide and heavy_hide not used

xSwap money and filter location

xRevisit flask and scroll material cost

xCrystal vs essence valuation
x- 3-2 esse/crys ratio  so if esse = 10, crys = 15
x- pricing



=====

=== ~2 days playing
Round 1
~~~~26 farming, 7 forestry, 23 foraging, 48 mining, 8 alch, 5 smithing, 17 cooking, 16 enchanting, 10 prayer, 15 inscript, 30 jewelcrafting
~~~~Full tin - Epic helm/boots/wep/neck (crazy rng). Rare chest/ring
~~~~52 atk, 34 def, 298 health, 18 str, 2.5 spd
~~~~Clears 2nd dungeon with 5ish pumpkin soup and world buffs, 7+ without world buffs, subsequent runs (half health) 10+ soup

=== ~2 days playing - no mass afk mining/farm this time
Round 2
15 farming 13 forestry 20 foraging 25 mining 14 alch 14 smith 18 cooking 11 enchanting 10 prayer 7 inscript 12 jewelcrafting
Copper !!helm !!chest !boots !!sword | !neck !!ring   - No helm enchant, not full sockets
47atk 33def 449health 11 str 2.7spd | +3str +2def +30health potion | +2prayer  | WB
7 berry with WB

xCow health/def little higher
x- easy to get like 15+ dmg and sub 4 second wep
xForestry to 15 1xp at a time before making tier2 gear a little tedious
x- Maybe make birch 3xp to start
x- Maple lvl 7/10    Did maple level 10 adjustment
xRemove key from loot pool once looted
xStop showing recipe from loot table once looted
x- Think if already learned recipe in loot pool it shows in recent loot even if nothing else
x- Works for loottable in Training but not Dungeon atm
xMight need to up rune chances to 3-5%
x- Possibly more, should be incentivized to craft a lil more than dungeon spam
x- Up drop rates even more, 10% even
x- Higher tier items require rune_of_chance_2 to achieve same effect etc. ezpz
x - Gives lower runes immense value early, gets user crafting, and prevents low-tier runes affecting late game
x - rune_of_chance_1 applies to copper-iron, rune_of_chance_2 to steel/mithril etc.
xDo we want junk + more from end of dungeon loot
x- Got single junk item from dungeon loot
x- No, isStackable and a rare junk/sell run fine
x!Craft time messed up if tool does not contain extraSpeed
x!2nd crafted slot not showing rune used
x!When loading page, any "npc" dropLocation loot loads into RecentDrops
xMaybe 2 leaf per ink
x- Not sure about 3 log per scroll yet
xScrolls probably made in inscription instead of alchemy
xLower gambling
x- Too expensive now
xLower shop markup as well
xIncrease silver dropped from dungeons, 2-3x
xFull heal 100-150
xBandit camp mobs base stats increased to roughly goblin level
x- Increase stat differential between copper -> bronze and most likely bronze -> iron
x- Also probably scaling cave mobs higher
x- Elites maybe fine/slightly higher, boss slightly lower
x- Up defense of either normal/elite in bandit slightly
xMaybe only 2 potent/lingering for flask
xMaybe required jewelcrafting skill to prospect higher ore
xMaybe prospect 100
x2 gems to socket
x- lower 3rd socket to 6x, maybe even 5x
x- lowered to 2x and 4x each
x - so its     2, 6, 12 per to fully socket item
x - instead of 3, 9, 27
x - 20 of each to fully socket helm, chest, wep
x - 8 to socket ring/neck/boots
x - 60 + 24 to fully socket gear from nothing
x - we got 50-80 of each prospecting ~ 2700 mithril which was about 4hrs mining
x6 rune of chance, 2 rune of rarity, 4 rune of enhancement after a getting 300+ pieces of gear
xRunes in Nice neck/ring
x10-15% drop rate for runes imo
x- 12% for cellar, 15% for cave, 20% for camp
x- good for copper, bronze, iron, prepping for 4th tier mobs
xInsta level up skill in admin menu
x- Lower as well for testing
xClose all Stats.jsx on page nav
xEquipment option for rightmenu on every screen
x- Maybe also buffs too
xAdd ctrl/shift compare to crafted hover
x- Comparing potential crafted stats on item to current item
xOn ctrl compare, expand flat stats on 2nd row below %
x- Or simply do % on 2nd row (ctrl then removing enchants/sockets and % on 2nd row)
x- Its nice to see "why" the number, but still want to see the number basically
x!Whole numbers displaying as +integer on ctrl screen
x!- +300% being +3
x!Rune of rarity did not upgrade normal to uncommon
xAdjust mob material cost of scrolls or increase duration
x- Scrolls probably should use misc item drops, fang/fur/hide not mob specific
x- Maybe 1 ink and 2 scroll instead of 2 ink 3 scroll
xPotions use misc item drops too, maybe prayer/gear reserved for mob specific
x- 1 instead of 2 of drop
~- 50-100% more root
~Maybe add tiers to items instead of making new items
~- rune_of_striking, tier 1, 2, 3. not rune_of_striking_3
~- In the tooltip it can say Striking III but as an item its rune_of_striking stats{tier: 3}
x- Still essentially need a "key" for each item and best to have it in the name anyway
x- Check inv for recipe as well, not just learned
~- Maybe 5% total for recipe split among remaining recipes
~ - Like runes but reroll till we get em all
xSave currently applied filters
xSort by name/amount
x- Rarity
x- Slot
- Category be nice but harder
xAuto restart after rest
x- Pause battle/resting
x- Check after every regen tick if ticked then proceed as usual
x- Can then probably keep Boss high and also increase elite mobs dmg
xBone/Hide gear
x- bone dagger
x- hide gear
x- lvl 1 smithing skill, no mining. just hide and bones

x!Hide/bone gear needs DE
xUp recipe drop rate
x- Even higher drop rate of recipes from end of dungeon for remaining ones
xMaybe lower material cost for gear
xLower smelting time of bars to ~1.5s-1s
xLower cooking crafttime
xIncrease stew health to above following tier's soup
xScroll and ink crafttime -> 2s
xStew crafttime -> 4s
~!Loottable not showing on mob going from mob -> dungeon -> mob or something
xRunes a lil higher, ~15%, ~20%, ~25%? Maybe x20 x24 x28
x- currently 12% for cellar, 15% for cave, 20% for camp
x- Maybe up chance for double by 5-10%
xShrink scroll/potion icon/button a tad on battle screen
x- potion
x - padding/margin for sure
x- scroll
xOrganize scrolls on battle by stat not rank
xWAS ALREADY DONE rune of strength +2 instead of +1 on smithing gear
x- later reflecting int on caster gear and agi on ranger gear
x- hmm already reflected +1 boots +2 helm +3 chest, revisit?
x!Thought all crafted came with single socket regardless of rarity
x- You never want to socket normal gear anyway, removed
xOn craftedItem hover, only offset Y when has slot
xCrafttime below exp gain in craft screen
xBat/imp also drop meat, even if lower %
xShrink buff icon sizes in battle a tad
x- Atk/Def stats too
xIf this.Battling, change battling icon
xThink lower socket/gem cost 1 more time
x-1x 2x 4x for sockets
xUp runeforged crafting rarity a bit
~!Using scroll stopping activity
~- should only stop battle
x- not sure. Battle highlighted now so better able to determine when it happens
xIf crafting equipped potion/food, auto equip
xUp corn droprate slightly on farmer
x- allows some decent elixir crafting ahead of time
x- moved to 15 foraging mushrooms for elixirs
~- maybe drop corn to lvl 20
~- maybe tomato soup to lvl 20
xForaging -> Herbalism
x- Elixirs need Herbalism ingredients
xDifferentiate dungeon loot from mob loot
xMaybe autocast healing potion at 15-20%?
x- Also highlight healing potion when health < potion amount
xProperly implement reroll/orbs
~Maybe silver cost for reroll based on item tier as well
~- Hard but enchant mats based on item, showing on hover
xChange herbalism leftmenu icon
~Add gather/craft speed scroll
x- Atk scroll as well
~vol3 items in cave and vol4 in bandit?
x!Exp from dungeon
xMaybe take out all mob-specific loot
x- Quest items later/build specialty gear

xShrine
x- mobs
x- loot
xCrypt
x- mobs
x- loot
Castle
- mobs
- loot

xImplement v3 of prayers/scrolls/gems/potions/food/enchants
x- prayer
x- scroll
x- potion
x- enchant
x- gem
x- food

xExp/price of new items
x- enchant
x- jewelcrafting
x- cooking
x- smithing
x- inscrip
x- prayer
x- alchemy

xSmithing VI/VII from crypt

xJewelcrafting levels
xthick_bone bury exp
xhealing_potion_2 mats
xiron tools
xIncrease xp on 2x and 3x socket

xbandit_stronghold needs iron+ loot
xcatacombs needs steel gear
shrine mobs drop mysterious_powder/holy_powder/mystic_powder/magic_dust somethin
- maybe later, over it atm

xCrypt/GY area focus on "unholy"/"dark"/"ghastly"

xAdd items/drops to graveyard
x- alch flask_2 potion_4
x- smithing
x- cooking
x- enchant
x- prayer
x- inscript
x- jewelcraft

xfix mahogony and things that use it

xBone tier 4 Hardened bone
xBone tier 5 Unholy bone

x100% drop rate for next zone key from dungeon
x- Indicate 100% drop rate in table

xRemove item also removes recipes/keys

xNext zone key
x- Sub 1% from last mob
x- 100% from dungeon

xPotency +50% value
xDuration +100% duration
x- atkspeed % when +5/is15% being weird
x- make sure duration apply correctly

xMake and use tier 2 elixirs

xAffixes post craft

xPotency for tier 2 potions/flasks

xHover over dungeon mob name reveals HP/Atk/Def
x- On training page

xOnly gamble tier 1 gear till tier 2 opened up
x- Only gamble tier 1/2 until 3 opened up etc
xUnlock tiers from gamblin by getting key

x!Update current craftnum if max less than current when selecting optional ingredients
xSave collapse/expand in craft screen

xSocket bonuses go up by item tier

xLower forestry pine 35 and mahogony 45
x- smithing/steel is 30 smithing
x- mithril is 40

x!DEing bronze helm can allow DEing multiple times for some reason without destroying item with quick DE
x- !DEing sorted items not being removed
x- Burying filtered+sorted works fine
x- Prospecting too
x - These also only reduce amount and not remove the item
x- toSorted index diff from inv index, simply use item now until issue
x - Then probably just sort inv and have it save

xCheckbox to auto refresh potion buffs

x!If recipe looted, can still drop

xDefense potions blue

xMaxHealth potions purple

~Better background art ~ basic
x- Crafting interface
~  - book themed (recipes/pages)

xChange all str enchants to attack
xChange all str gems to attack

xLet gems be updatedable on gear
xLet enchants be updatedable on gear

xHave color of flasks mimic potion equivalents




Leveling
- Caves should be about level 20
- Simple system +2% atk / +2% def / +2% health / +2% atkspeed

Leveling/talent system
- Increase atk/def/health 2/3%
- Incease stats from alch/prayer/inscript 5%
- Increase gathering speed 2/3% each
- Increase craft chance for bonus loot 2% each
- Talent system
 - Possibly 2 trees, 1 flat stat points other % buffs
 - respec costs money but can do so endlessly for a price



==

Review MVP/Must haves, list here and get commited and a build deployed
x- 6 dungeons of mobs and loot tables
x - All mobs with art
x- All items with icons
x - All items with description if necessary
x- Craft page BG/style updated
x- Maybe 5 dungeons and 6 is endless like M+ (10+%)/Delve (1%/2%)
 - Endless later

xCommit
x- images
x - stat and bufficons
x - skills
x - bgs
x - mobs
x - items
x- stylesheets
x - common
x - entry+main
x - dungeon
x - stats
x - battle
x - craft
x - inv
x - shop
x- components
x - entry+main
x - dungeon
x - stats
x - battle
x - craft
x - inv
x - shop
x- yamls
x - items
x - mobs
x- main.js

Price enchanting essence/crystals

Post deploy
- Roadmap page
- Auth/Login


Properly proportion mob sizes
- ex Lich probably 2x player size, banshee 1.5x, bruiser 1.5x

==

Scrunch enchanting levels, every 10 levels each tier of mats

Remove root, new herb for t3 alch items ideally
- herbs every 5 levels for alch probably
- revamp alch t3 from lvl 5/10 farm to new herb tiers

xReadjust forestry/wood levels for smithing items
- Also keep in mind readjustment for inscript





Create a unique mob/boss for each dungeon

Quests to turn in X certain items and get a Rare of X slot

Min damage change to 0.5%-1% of max health?
Or 3-5% of attackers damgage

Different tiers of scrolls maybe? Maybe just make interchangable to make with any wood
- Ya most likely this, while not efficient, can make scrolls while leveling forestry
  and using leftover wood
- 2xtier1 makes 1
- 1xtier2 makes 1
- 2xtier3 makes 2
- 1xtier4 makes 2 ? 
- Havnt made "makes at least 2" type yet

Play with idea ingredients take longer, recipes costs more, no craft time

Recipe/ingredient checker/helper
- Post deploy
- Bring in all items/recipes and detect what items are not used
- Detect how many recipes/amount of each item used etc

Price generator
- Post deploy
- Feed in raw material cost, spit out price and adjustable markup
- Probably an excel sheet with vlookups to start?

Exp calculator
- Get exp to level laid out 1-40
- Mainly should be 7-12 crafts per level depending on skill
- 15ish DE + 2 enchants per lvl?


Salvage for a fraction of the recipe cost
- say 8 copperbar, get 1-2 back
- maybe only bars and random chance at other pieces

Required stats/level
- How to handle levels/stats

Rare dungeon drops for certain enchants

Increased % healing stat/scrolls etc

xMore generic multi-mob drops
x- fangs/hides/furs/cloth etc
x- ensure proper distribution among tiers
- spreadsheet of items and consumption in recipes

1 minute food buffs on consumption
 - Maybe start with regen only for now
 - Or ele resistances
 - Fish ingredients give buff
  - Can be enhancement

Maybe a shadow/glow/animated glow on rare/epic drops in recentactivity

Boon world buffs
- Later, gotta remove stats, save duration to an item, not allow double up

Limit 1 Rune and 1 Orb per craft etc
- Later, once allowing 2 enhancements

Gem rarities
- multi-stat colors lower drop chance 
- maybe multi-stat just starts at uncommon II
- uncommon for II,   +2
- rare for III,      +3
- epic for IV        +4

Shop, when puchase/sell, little fading animation around money, like damage

Resistances/Ele damage

Slash/Piece/Blunt damage
- Base def + phys/ele resistance
- Elemental damage

Weapon imbues
- "Potion effect" for weapon - ice, fire, holy, shadow, earth


Craft improvements later
~- Categorize potions/flasks based on stat?
- Or a little filter button at top and filter those items
  - predetermined filters - stats only
  - Filter OR category? Like Loot Table / Equipment

Maybe even make a rune class type item
- Start thinking of more classes/categories of items
- Put effect into item itself like Elixirs
- Can add tiers to items this way too

Try adding % based affixes
- Needs to be constantly be looking at current stats minus affixes and say even enchants
- Idea is post craft AND sockets if possible but sounds iffy
- +X% [single] STAT (excluding affixes)

When hovering over an item, never let the bottom Y axis go above/below screen
- Wowhead achieves this
 - https://www.wowhead.com/classic/gear-planner/warrior/dwarf/BDwAAA
 - https://www.wowhead.com/items
- Start expansion upward or downward depending on X/Y position


Kinda later things
----------


Review crafted stats on higher tier loot


Farming a passive/background thing when we implement fishing?
Maybe fishing also a passive thing you can do while crafting
- Farming + Fighting + Disenchant/Sell/Bury bones
- Farming + Crafting + Disenchant/Sell 
- Farming + Mining + Prospecting ore

Glossary of items and where they drop
- Would also help determining if items in mob/dungeon/recipe pool

Review Runes/Runewords while looking into dungeon drops
- White sockets
- 2-3 White socket runewords
- Maybe prismatic?

Mixed stat potions
Later, no stacking single potions, but mixed multi-stats DO stack
- str + str/health + str/def
- health + str/health + health/def
- int + int/health + health/def
- int + int/def + health/def
- % based buffs
- agi + agi/3% + 3%/def
- agi + agi/3% + 6%
- health/3% + agi/3% + 6%

How much "offline" action can happen
- Battling - think no
  - Battling to many variables to simulate
- Health regen - think yes
  - Difference between last tick and time now on load
  - Heal x ticks unless maxhealth
- Crafting - think yes
  - Crafting slightly more complicated
- Gathering - think yes
  - Gathering and health regen simpler
  - Difference between last tick and time now on load
  - Gather x times

Other defense stats like parry and dodge
- Str affects parry %
- Agi affects dodge %
- Int affects Ele/magic resist %

Combat Regen
Lifesteal
Poison
Bleed
Curse

Gauntlet/randomized/roguelike mode for replayability
- recipe drops determining runs
- randomized recipes. smithing copperbar coppersword bronzebar bronzehelm etc

Dungeon mobs equip random items
- Introduces randomness to mobs in dungeons
- Mob can end up with more health/def/attack based on num and quality of items


== META ==
Determine whats a good amount of time to spend on each skill before advancing
- ex. 5 min per item skill before unlocking next?  
- how many minutes/kills per mob before next should be killed/farmed

Make sure no early-game items are overpowered/last til late game

Challenges/Achievements
- No potions
- No food
- No shop
- No enchanting/jewelcrafting/smithing/alchemy/X skill

- No deaths/HC
- Prestige

#### Random brainstorming ideas

// Releases/Phases/Seasons for reset
// Maybe even private/stream sessions
//  - Tangia raids
//  - Character only active/exists in streamers stream
//  - Acting as a "roll call" for raids to get better gear etc
//  - Players cannot progress while stream not active etc.
//  - Players can then use these characters while stream is live
//  - Effectively acting as a "Stream/Guild found" character
//  - Streamer dungeons
//  - Streamer raids/battles  - Twitch extension
//    - AV style GY/Bunker PoI to capture
//    - Chat vs Chat battles/raids. 10v10 20v20 50v50 100vs100
//   Twitch ext interactions
//     Visible true/false
//     Add to my channel
//     Build an extension
//     Manage access
//   Action phase
//   People able to select unit/location from overlay
       
// Evergreen
// Probably no leaderboards - encourages cheating
// Dueling record
// Twitch/Discord integration
//    - commands to give/interact with players
//    - possibly currency/potions/non-"bound" items
// Multiplayer/mafia.gg esque co-op exp
//  - Maybe level scaling so 95s can join 45s without being OP
//  - Option user can toggle
// Turn-based/decision-based co-op "dungeons/raids"
// Everyone chooses "action" like mafia picking/polling system
// LFG group system
// Bi-hourly dungeons/raids
// World boss - 50-100 players all attacking - scales - obv players dont interact with each other and supposed to keep themselves up - boss simply does aoe mechanics
//x Keys for dungeons
// Combo style sequences - queue up your attack rotation - atk/atk/heal/defend/pray repeat etc
// RPG/Quick play session versions/sessions
//   - ramped up speeds/rewards for faster paced/arcade version
//   - enemies grow stronger as time passes, important to be optimal or you'll lose vs rpg/static
// Hardcore version
// Discord notifications
//   low potions/food/consume
//   dead
//x Hourly/Every x Hours buffs for all players for X minutes (world buffs)
// Gambling currency
// Maybe monthly season, cap 50%, 80% 1st and 2nd weeks
// Host speedrun events
//  - Top 10 fastest to kill X dungeon
//  - Time trial, how far in 2 hrs
//  - Winners get in-game event prize
//  - Maybe bottled buffs, exp, yield, power, magicfind/increase rarity, choice

// PVP mode / Backpack Battles / Turnbound
// Cumulative skill level cap?
// - Player level range
//  - Player stats/talents
// - Skill level range
//  - Most efficient use of skill levels
//  - Enchant/JC/Alch still needs Mining/Farming/Dungeon leveling/Smithing/Cooking/Forestry etc




// >>Gathering
// x Farming
// x Forestry
// x Foraging
// x Mining
// x Herbalism
// x Skinning
// x Disenchanting
// x Salvage/Cloth
//
// >>Production
// x Cooking
// Woodworking/Boat Building
// x Fletching
// x Smithing
// x Tailoring
// x First Aid
// x Husbandry
// x Enchanting
// x Leatherworking
// x Alchemy
//
// >>Player Progress
// Currency/Traders
// Researching
//  ^Int/Wis/Const
// Training
//  ^Str/Agi/Sta
// ^Skills
//  ^^ Stab/Slash/Block
//  ^^ Range/Cripple/Dodge
//  ^^ Magic/Slow/Barrier
//  ^^ Heal/Boost/Pray
// Housing/Estate
// Magic
// Dungeoning/Dragonslaying
// Sailing
// Dueling
//
// ???
// Excavating/Archeaology
// Rune Deciphering
// Magic finding
// xInk/Dye/Scrolls
// xGems/Jewels/Socketing
//
// >Tools
// x^Pieces - Handle/Hilt - Blade
// xPickaxe
// xAxe
// xShovel
// ~Knife
// ~Spear


## Super long term/brainstorm
Harder endgame drops infinitely scaling materials for consumes to be bought/sold/traded
- Way later, brainstorm how to make games interesting after gear capped

Pixel monsters
- idle animation, attacking animation, defending animation
