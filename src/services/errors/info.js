export function generateProductErrorInfo(product) {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    *title : needs to be a String, received ${product.title}
    *description : needs to be a String, received ${product.description}
    *price : needs to be a Number, received ${product.price}
    *thumbnail : needs to be an Array, received ${product.thumbnail}
    *code : needs to be a String, received ${product.code}
    *stock : needs to be a Number, received ${product.stock}`;
}
