// category filter
export const categoryFilterStyles = (theme) => ({
  display: "flex",
  overflowX: "auto",
  whiteSpace: "nowrap",
  background: theme === "dark" ? "#2e2e2e" : "#fcfcfc",
  scrollbarWidth: "none", // Hide scrollbar for Firefox
  msOverflowStyle: "none", // Hide scrollbar for IE/Edge
  gap: "10px",
});

export const categoryButtonStyles = {
  margin: "0 5px", // Button spacing
  flexShrink: 0, // Prevent shrinking
};

export const hiddenScrollbar = {
  display: "none", // Hide the scrollbar in Chrome/Safari
};

// footer
export const footerStyles = {
  // Footer container style with dynamic background and color based on theme
  container: (theme) => ({
    position: "relative",
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: theme === "dark" ? "#1e1e1e" : "#d9d9d9",
    color: theme === "dark" ? "white" : "black",
  }),

  // Footer text style (reused for each Text component)
  text: {
    fontSize: "small",
  },
};

// product card
export const productCardStyles = {
  // Card container style
  cardContainer: {
    border: "none",
    backgroundColor: "transparent",
    boxShadow: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "hidden",
    cursor: "pointer",
  },

  // Image container style
  imageContainer: {
    width: "100%",
    aspectRatio: "1/1",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  // Skeleton image style while loading
  skeletonImage: {
    width: "80%",
    height: "80%",
    backgroundColor: "transparent",
  },

  // Product image style
  image: {
    width: "100%",
    height: "100%",
    aspectRatio: "1/1",
    objectFit: "scale-down",
  },

  // Image error container
  imageErrorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  // Error text when image fails to load
  imageErrorText: {
    color: "#888",
  },

  // Text section container style
  textSection: {
    padding: "10px",
  },

  // Product name text style
  productName: {
    margin: 0,
  },

  // Product price text style
  productPrice: {
    fontSize: "16px",
  },

  // Inbox icon style for low stock
  inboxIcon: {
    color: "#ff7875",
  },

  // Remaining stock text style
  remainingText: {
    fontSize: "14px",
    color: "#ff7875",
  },
};

// main
export const mainPageStyles = {
  carouselImage: {
    width: "100%",
    height: "auto",
  },

  bannerSpace: {
    marginBottom: "10px",
  },

  row: {
    marginBottom: "10px",
    padding: "0 10px",
  },

  card: {
    width: "100%",
    // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
  },

  branchTitle: {
    fontWeight: "bold",
    fontSize: "x-large",
  },

  branchInfoContainer: {
    display: "flex",
    flexDirection: "column",
  },

  emptyStyle: {
    marginTop: "100px",
  },

  modalStyle: {
    textAlign: "center",
  },

  certificationModal: {
    display: "flex",
    justifyContent: "center",
    margin: "10px",
  },

  ageCircle: {
    fontSize: "xx-large",
    marginRight: "10px",
    fontWeight: "bold",
    border: "3px solid #ff4d4f",
    padding: "10px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
  },

  modalContent: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
  },

  modalText: {
    fontSize: "small",
    opacity: "0.7",
    textAlign: "left",
  },

  certButton: {
    width: "100%",
  },
};

// cart
export const cartStyles = {
  container: {
    backgroundColor: "#f1f1f1",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  cartContainer: {
    backgroundColor: "white",
    padding: "20px",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    borderRadius: "8px",
    position: "relative",
    marginBottom: "20px",
  },

  deleteButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 10,
  },

  checkbox: {
    position: "absolute",
    top: "10px",
    left: "10px",
    fontSize: "16px",
  },

  cardContent: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginTop: "20px",
  },

  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
    marginRight: "16px",
  },

  productInfo: {
    flex: 1,
  },

  productSpace: {
    width: "100%",
  },

  productPrice: {
    fontSize: "16px",
    color: "#ff4d4f",
  },

  inputNumber: {
    width: "80px",
    borderRadius: "4px",
    fontSize: "16px",
  },

  totalAmountContainer: {
    textAlign: "right",
  },

  totalAmount: {
    fontSize: "16px",
  },

  relatedProducts: {
    backgroundColor: "white",
    padding: "20px",
  },

  relatedProductsText: {
    fontSize: "16px",
    fontWeight: "bold",
  },

  footer: {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 9999,
    boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
    gap: "10px",
  },

  footerContent: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  selectAllCheckbox: {
    fontSize: "16px",
  },

  buyButton: {
    width: "100%",
  },
};

// product
export const containerStyle = (isLarge) => ({
  marginBottom: isLarge ? "0px" : "54px",
});

export const cardStyle = (isLarge) => ({
  display: "flex",
  flexDirection: isLarge ? "row" : "column",
  alignItems: "center",
  padding: "20px",
  border: "1px solid #f0f0f0",
  borderRadius: "10px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  flexWrap: "wrap",
});

export const imageStyle = (isLarge, materialData) => ({
  width: isLarge ? "300px" : "100%",
  height: isLarge ? "300px" : "auto",
  aspectRatio: "1/1",
  maxWidth: "300px",
  backgroundImage: `url(${materialData?.original_image})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "10px",
  marginBottom: isLarge ? "0" : "20px",
});

export const descriptionStyle = {
  flex: 1,
  marginLeft: "20px",
};

export const buttonGroupStyle = (isLarge) => ({
  display: isLarge ? "flex" : "none",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
});

export const buttonStyle = {
  width: "100%",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

export const buyButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#ff4d4f",
  borderColor: "#ff4d4f",
  color: "#fff",
};

export const addToCartButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#fff",
  borderColor: "#ccc",
  color: "#333",
};

export const fixedBottomStyle = (theme) => ({
  position: "fixed",
  bottom: "0",
  right: "0",
  left: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px 10px",
  backgroundColor: theme === "dark" ? "#1e1e1e" : "white",
  color: theme === "dark" ? "white" : "black",
  zIndex: 9999,
  boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
  gap: "10px",
});
