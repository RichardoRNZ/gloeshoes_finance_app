export const generateRandomColors = (numColors) => {
    const dynamicColors = [];
    for (let i = 0; i < numColors; i++) {
        dynamicColors.push(
            `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
                Math.random() * 256
            )}, ${Math.floor(Math.random() * 256)})`
        );
    }
    return dynamicColors;
};

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    centerText: {},
};
export const centerTextPlugin = {
    id: "centerText",
    afterDraw: (chart) => {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;
        const centerX = width / 2;
        const centerY = height/1.5;

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 20px Arial";

        ctx.fillStyle = "#1c1ea9";

        // Menghitung total nilai
        const total = chart.data.datasets[0].data
            .map((value) => Number(value)) // Ubah setiap elemen menjadi number
            .reduce((acc, value) => acc + value, 0)+" Pcs";

        // Menambahkan teks di tengah
        ctx.fillText(total, centerX, centerY);
        ctx.restore();
    },
};
