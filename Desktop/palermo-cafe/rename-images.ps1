# Script para renombrar imagenes de Palermo Cafe
# Fase 2: Nombres descriptivos en espanol

$imagesDir = "C:\Users\Edgardo\Desktop\palermo-cafe\public\images"
$backupDir = "C:\Users\Edgardo\Desktop\palermo-cafe\public\images-backup"

# Crear respaldo
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
    Write-Host "[OK] Directorio de respaldo creado" -ForegroundColor Green
}

# Copiar todas las imagenes al respaldo
Copy-Item "$imagesDir\*" -Destination $backupDir -Force
Write-Host "[OK] Respaldo completado: $backupDir" -ForegroundColor Green

# Mapa de renombrado: nombre_actual -> nombre_nuevo
$renameMap = @{
    # COMIDA - Ssandwiches y platos principales
    "469099053_18098800318481469_8518011593314503330_n.jpg" = "sandwich-chicharron-clasico.jpg"
    "469113464_18098799985481469_6415885035401861633_n.jpg" = "sandwich-jamon-pais.jpg"
    "469286993_18098799976481469_2498583453108402891_n.jpg" = "sandwich-pollo-crunch.jpg"
    "469365855_18098796946481469_3967362413419529432_n.jpg" = "sandwich-lomo-fino.jpg"
    "469396893_18098799970481469_2516529037170285467_n.jpg" = "sandwich-pavo-especial.jpg"
    "469397172_18098800252481469_6682647190518805861_n.jpg" = "sandwich-chorizo.jpg"
    "469423172_18098796901481469_2958204559364993698_n.jpg" = "sandwich-butifarra.jpg"
    "469437737_18098800015481469_1570712037115993451_n.jpg" = "sandwich-ripcion.jpg"
    "469454660_18098797732481469_2536219787521249211_n.jpg" = "hamburguesa-clasica.jpg"
    "469456593_18098800291481469_4584614079122893762_n.jpg" = "sandwich-choripan.jpg"
    "469461177_18098799541481469_2191642606884966755_n.jpg" = "salchipapa-especial.jpg"
    "469569338_18098799988481469_8559109923004732212_n.jpg" = "pan-con-pollo.jpg"
    "469569352_18098796961481469_6723229358074350459_n.jpg" = "chicharron-frito.jpg"
    "469583719_18098799553481469_3238644507596001065_n.jpg" = "papa-a-la-huancaina.jpg"
    "469661981_18098799757481469_1759154645233360409_n.jpg" = "arroz-con-pollo.jpg"

    # COMIDA - Desayunos
    "470083965_18099280282481469_5529634106680707661_n.jpg" = "desayuno-completo.jpg"
    "474513906_18103542763481469_7446997254976959950_n.jpg" = "tamal-con-pan.jpg"
    "474910756_18103542754481469_6139019460841402460_n.jpg" = "tamal-solo.jpg"
    "474924717_18103542745481469_15289623265066305_n.jpg" = "tamal-con-aji.jpg"

    # COMIDA - Platos variados
    "480699059_929369292745873_4827987200011118829_n.jpg" = "papas-rellenas.jpg"
    "480699510_928125239536945_4445838410974472365_n.jpg" = "ocopa-ahuancaina.jpg"
    "480702466_933099735706162_6695899474937635910_n.jpg" = "causa-rellena.jpg"
    "480814248_928571456158990_7756068713946462407_n.jpg" = "lomo-saltado.jpg"
    "480874558_927481312934671_1815015036525203003_n.jpg" = "arroz-tacu-tacu.jpg"
    "480904459_933803292302473_2674672528679196015_n.jpg" = "tallarin-saltado.jpg"
    "480979892_927493462933456_4215061293743819495_n.jpg" = "papas-provenzal.jpg"
    "481063660_933099709039498_3864476213413540387_n.jpg" = "yuca-frita.jpg"
    "481072431_934150758934393_4391308999648683037_n.jpg" = "ensalada-fresca.jpg"
    "481074595_933099689039500_260170142559294383_n.jpg" = "papas-watia.jpg"
    "481084825_934145575601578_6620229008927633979_n.jpg" = "tamales-dulces.jpg"
    "481102272_934170025599133_7329287256242983222_n.jpg" = "cuy-chactado.jpg"
    "481104507_934868938862575_7184784822748881250_n.jpg" = "puerro-con-salsa.jpg"
    "481149970_933803312302471_4933918283969116747_n.jpg" = "papa-rellena-carne.jpg"
    "481166871_933102699039199_8325344203056984108_n.jpg" = "pollo-a-la-brasa.jpg"
    "481167745_933099839039485_3596826271164364677_n.jpg" = "chicharron-solo.jpg"
    "481170217_928169239532545_6661819079097214153_n.jpg" = "papas-crocantes.jpg"
    "481255595_935511938798275_8026655183120818710_n.jpg" = "pan-con-chorizo.jpg"
    "481265638_933099699039499_8851305756410279334_n.jpg" = "papas-con-mayo.jpg"
    "481271241_933467989002670_574451975226545175_n.jpg" = "tamal-verde.jpg"
    "481302034_933459799003489_5004722626141595483_n.jpg" = "sandwich-vegano.jpg"
    "481354984_935018458847623_8422880928230238901_n.jpg" = "arroz-con-mariscos.jpg"
    "481454271_934147595601376_1520173863274751781_n.jpg" = "papa-rellena-aji.jpg"
    "481456459_933803302302472_1372541701250982960_n.jpg" = "chicharron-dorado.jpg"
    "481661234_933462949003174_8794266187866683601_n.jpg" = "sandwich-italiano.jpg"
    "481700977_18106962751481469_4354600282954845949_n.jpg" = "papa-watia-caldo.jpg"
    "481705055_18106962769481469_6825130420956825985_n.jpg" = "chicharron-con-pan.jpg"
    "481769931_933981938951275_8811673644936515552_n.jpg" = "papa-a-la-huancaina-2.jpg"
    "481875301_18106962748481469_8683068465438863238_n.jpg" = "tamal-charqueta.jpg"
    "481912765_933462855669850_6724159324690898361_n.jpg" = "pan-con-chicharron.jpg"
    "481946944_18106962739481469_2556672859010049264_n.jpg" = "sandwich-de-pavo.jpg"
    "481955912_933810308968438_8899282196059560662_n.jpg" = "papas-fritas-con-queso.jpg"
    "482031042_933803295635806_5115287061375872467_n.jpg" = "chicharron-crujiente.jpg"
    "482032375_934147578934711_2535802002422485488_n.jpg" = "sandwich-vegetariano.jpg"
    "482071637_934153175600818_113658980856669602_n.jpg" = "papas-con-huevo.jpg"
    "482142447_18106962766481469_8489615590451495260_n.jpg" = "papas-con-salsa.jpg"
    "482909971_18107677381481469_8612908232253940728_n.jpg" = "chicharron-de-cerdo.jpg"
    "483181541_18107677372481469_174056802659904043_n.jpg" = "sandwich-de-jamon.jpg"
    "483899781_18108391033481469_3814546748067213259_n.jpg" = "sandwich-doble.jpg"
    "484313405_18108391042481469_2847952208603934198_n.jpg" = "papas-watia-especial.jpg"
    "504197393_18116306542481469_4081882349303200015_n.jpg" = "sandwich-grande.jpg"
    "566910973_18128749726481469_5579358839573574417_n.jpg" = "chicharron-con-tamal.jpg"
    "573095269_18131477245481469_423783158974559438_n.jpg" = "papa-rellena-especial.jpg"
    "589185179_18135040081481469_3482279697941459512_n.jpg" = "sandwich-americano.jpg"
    "682718274_18150016258481469_1277045926400640607_n.jpg" = "papas-con-chicharron.jpg"
    "682724983_18150016279481469_121552471434500489_n.jpg" = "sandwich-tradicional.jpg"
    "683455538_18150016270481469_7530306754378221265_n.jpg" = "tamal-grande.jpg"

    # PROMOS/COMBOS
    "686955667_18150515668481469_387511706029135773_n.jpg" = "combo-mesa-campeon.jpg"
    "709844335_18152883931481469_4379460870978930042_n.jpg" = "promo-dia-padre.jpg"
    "710351447_18152883952481469_5478888766367124682_n.jpg" = "combo-dia-madre.jpg"

    # BEBIDAS
    "cafe.jpg" = "cafe-espresso-preparacion.jpg"
    "cafee.jpg" = "cafe-portafiltro-granos.jpg"

    # COMIDA - Nombres simples
    "pan con pollo.jpg" = "sandwich-pollo-desmenuzado.jpg"
    "tamal.jpg" = "tamal-amarillo-porcion.jpg"
}

# Ejecutar renombrado
$successCount = 0
$errorCount = 0
$errors = @()

foreach ($oldName in $renameMap.Keys) {
    $oldPath = Join-Path $imagesDir $oldName
    $newName = $renameMap[$oldName]
    $newPath = Join-Path $imagesDir $newName

    if (Test-Path $oldPath) {
        try {
            Rename-Item -Path $oldPath -NewName $newName -Force
            $successCount++
            Write-Host "[OK] $oldName -> $newName" -ForegroundColor Gray
        } catch {
            $errorCount++
            $errors += "[ERROR] Renombrando $oldName : $_"
            Write-Host "[ERROR] $oldName - $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        $errorCount++
        $errors += "[NOT FOUND] $oldName"
        Write-Host "[NOT FOUND] $oldName" -ForegroundColor Yellow
    }
}

# Resumen
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DEL RENOMBRADO" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "[OK] Renombradas exitosamente: $successCount" -ForegroundColor Green
Write-Host "[ERROR] Errores: $errorCount" -ForegroundColor Red
Write-Host "[BACKUP] Respaldo en: $backupDir" -ForegroundColor Yellow

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "Errores detallados:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
}

Write-Host ""
Write-Host "Proceso completado!" -ForegroundColor Green
