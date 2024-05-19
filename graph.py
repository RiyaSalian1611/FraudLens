import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt

# Load CSV data
df = pd.read_csv('output.csv')

# Select 4-5 customers by customer_id
customer_ids = ['C1000148617', 'C100045114', 'C1000699316', 'C1001065306', 'C1002658784']

# Create a figure with multiple subplots
num_customers = len(customer_ids)
fig, axs = plt.subplots(1, num_customers, figsize=(5*num_customers, 5))

# Loop through each customer and create a node-link graph
for i, customer_id in enumerate(customer_ids):
    customer_data = df[df['customer_id'] == customer_id]

    # Create graph
    G = nx.Graph()

    # Add nodes for the selected customer and its categories
    G.add_node(customer_id)
    for category in customer_data.columns[3:]:
        G.add_node(category)

    # Add edges between the customer and its categories
    for category in customer_data.columns[3:]:
        G.add_edge(customer_id, category)

    # Compute layout using spring_layout algorithm
    pos = nx.spring_layout(G)

    # Visualize the graph for the selected customer
    nx.draw_networkx_nodes(G, pos, node_size=300, node_color='skyblue', alpha=0.8, ax=axs[i])  # Draw nodes
    nx.draw_networkx_edges(G, pos, width=1, alpha=0.5, edge_color='gray', ax=axs[i])  # Draw edges
    nx.draw_networkx_labels(G, pos, labels={node: node for node in G.nodes()}, font_size=12, ax=axs[i])  # Add labels
    axs[i].set_title(f"Customer {customer_id}")  # Add title
    axs[i].axis('off')  # Turn off axis

# Save the final output image
plt.tight_layout()
plt.savefig('customer_graphs.png')
#plt.show()
