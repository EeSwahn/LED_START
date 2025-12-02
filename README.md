# LED Soft-Start Simulator / LED 软启动模拟器

This application visualizes and compares three different mathematical strategies for dimming or starting up an LED light. Users can select a mode to see how the brightness output changes over time compared to the perceived brightness.

这是一个可视化应用程序，用于比较三种不同的 LED 调光/启动数学策略。用户可以选择不同的模式，观察亮度输出随时间的变化以及与视觉感知的差异。

## Curves Explained / 曲线说明

### 1. Linear Ramp (线性启动)
**Formula / 公式:** $y = x$
*   **English:** The PWM duty cycle increases linearly from 0% to 100%. While mathematically simple, it often looks abrupt to the human eye because our vision is non-linear. We are very sensitive to changes in low light.
*   **中文:** PWM 占空比从 0% 线性增加到 100%。虽然数学上很简单，但由于人眼的非线性视觉特性（对弱光变化非常敏感），这种启动方式在视觉上看起来会非常突然。

### 2. S-Curve (S型 / Sigmoid)
**Formula / 公式:** Cubic Bezier / Sigmoid function
*   **English:** Uses an "Ease-in-Out" approach. The brightness increases slowly at the start, accelerates in the middle, and slows down as it reaches maximum. This mimics natural motion and physics, feeling very high-end and smooth.
*   **中文:** 采用“缓入缓出”的方法。亮度在开始时缓慢增加，中间加速，接近最大值时减速。这模仿了自然界的运动规律，给人一种非常高级、流畅的视觉感受。

### 3. Logarithmic (对数启动)
**Formula / 公式:** $y = \log_{10}(9x + 1)$
*   **English:** This curve is designed to compensate for the Weber-Fechner law of human vision (Gamma Correction). By increasing power rapidly at the start (mathematically) and tapering off, the *perceived* increase in brightness looks perfectly linear to the human eye.
*   **中文:** 该曲线旨在补偿人眼的韦伯-费希纳定律（伽马校正）。通过在开始时迅速增加功率（数学上）并在后期减缓，最终在人眼看来，亮度的增加是均匀线性的。

## Tech Stack / 技术栈

*   React 18
*   TypeScript
*   Tailwind CSS
*   Recharts
*   Lucide React (Icons)
