export default function CheckerboardBg() {
  return (
    <div
      className="fixed inset-0 -z-10 opacity-5"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `
          linear-gradient(45deg, #000 25%, transparent 25%),
          linear-gradient(-45deg, #000 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #000 75%),
          linear-gradient(-45deg, transparent 75%, #000 75%)
        `,
        backgroundSize: "2rem 2rem",
        backgroundPosition: "0 0, 0 1rem, 1rem -1rem, -1rem 0",
      }}
    />
  );
}
