from collections import deque

def bfs(start, adj_list, distances):
    queue = deque([start])
    distances[start] = 0
    
    while queue:
        current = queue.popleft()
        for neighbor in adj_list[current]:
            if distances[neighbor] == -1:  # If the neighbor has not been visited
                distances[neighbor] = distances[current] + 1
                queue.append(neighbor)

def main():
    N = int(input().strip())  # Number of outlets including the warehouse
    K = int(input().strip())  # Number of outlets requesting extra inventory
    
    requested_outlets = list(map(int, input().strip().split()))
    
    M, X = map(int, input().strip().split())  # Number of roads (M = N-1) and outlets connected by each road (X = 2)
    
    adj_list = [[] for _ in range(N + 1)]  # Adjacency list to represent the tree
    
    for _ in range(M):
        u, v = map(int, input().strip().split())
        adj_list[u].append(v)
        adj_list[v].append(u)
    
    distances = [-1] * (N + 1)  # Distance from warehouse (node 1)
    bfs(1, adj_list, distances)
    
    requested_distances = [distances[outlet] for outlet in requested_outlets]
    
    requested_distances.sort()
    
    max_outlets_covered = 0
    current_distance_sum = 0
    
    for dist in requested_distances:
        if current_distance_sum + dist <= N - 1:
            current_distance_sum += dist
            max_outlets_covered += 1
        else:
            break
    
    print(max_outlets_covered)

if __name__ == "__main__":
    main()
