Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(128,128)
$g = [System.Drawing.Graphics]::FromImage($bmp)

# Colors
$blue = [System.Drawing.Color]::FromArgb(0, 120, 212)
$white = [System.Drawing.Color]::White
$gray = [System.Drawing.Color]::LightGray
$black = [System.Drawing.Color]::Black

# Clear background (transparent)
$g.Clear([System.Drawing.Color]::Transparent)

# Draw Clipboard Body (Blue rounded-ish rectangle)
$brush = New-Object System.Drawing.SolidBrush($blue)
$g.FillRectangle($brush, 20, 15, 88, 100)

# Draw Paper (White rectangle)
$paperBrush = New-Object System.Drawing.SolidBrush($white)
$g.FillRectangle($paperBrush, 30, 30, 68, 75)

# Draw 'Lines' on the paper (Attendance rows)
$pen = New-Object System.Drawing.Pen($black, 2)
$g.DrawLine($pen, 40, 45, 88, 45)
$g.DrawLine($pen, 40, 60, 88, 60)
$g.DrawLine($pen, 40, 75, 88, 75)
$g.DrawLine($pen, 40, 90, 88, 90)

# Draw the Clip at the top
$clipBrush = New-Object System.Drawing.SolidBrush($gray)
$g.FillRectangle($clipBrush, 45, 10, 38, 15)

# Save the file
$bmp.Save("C:\Users\danie\OneDrive\Desktop\AbsenceSystemProject\extension\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$g.Dispose()
$bmp.Dispose()
