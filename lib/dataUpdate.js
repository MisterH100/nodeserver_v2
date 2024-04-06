import ProductOrder from "../models/product_order.model.js";
import GraphData from "../models/graph.model.js";

export const updateGraphData = async () => {
  try {
    const data = await ProductOrder.find({});
    const revenue = data
      .map((d) => {
        if (
          new Date(d.orderDate).getMonth() == new Date(Date.now()).getMonth()
        ) {
          return d.price;
        }
        return 0;
      })
      .reduce((prev, curr) => prev + curr, 0);

    const sold = data
      .map((d) => {
        if (
          new Date(d.orderDate).getMonth() == new Date(Date.now()).getMonth()
        ) {
          return d.products.length;
        }
        return 0;
      })
      .reduce((prev, curr) => prev + curr, 0);

    const graph_data = new GraphData({
      date: new Date(Date.now()),
      revenue: revenue,
      sold: sold,
    });

    await graph_data.save();
    console.log("Graph data updated");
  } catch (error) {
    console.log("Error on graph data update", error);
  }
};
