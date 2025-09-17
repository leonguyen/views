// Demo: Bootstrap Card
const card = new Card()
  .addHeader("VanJS Card")
  .addBody("This card was rendered using VanJS integration!");

van.add(document.querySelector("#app"), card.toVanNode());

// Demo: AdminLTE InfoBox
const infoBox = new AdminLTEInfoBox("fas fa-user", "Users", "1200", "success");
van.add(document.querySelector("#app"), infoBox.toVanNode());

// Demo: Progress Bar with mountWithVan
const pb = new ProgressBar();
pb.mountWithVan(document.querySelector("#app"));
setTimeout(() => pb.update(70), 1500);

// Demo: Tabulator Table
const table = new TabulatorTable("userTable",
  [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }],
  [{ title: "ID", field: "id" }, { title: "Name", field: "name" }]
);
table.mountWithVan(document.querySelector("#app"));
