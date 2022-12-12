use std::collections::{HashMap, HashSet};
use std::ops::Index;

type Elevation = i8;
type Coord = usize;
type Distance = i32;

#[derive(Copy, Clone, Debug, Eq, Hash, PartialEq)]
struct Point(Coord, Coord);

struct ElevationMap {
    cells: Vec<Vec<Elevation>>,
    start: Point,
    target: Point
}

impl ElevationMap {
    fn from(input: &str) -> Self {
        let mut start: Option<Point> = None;
        let mut target: Option<Point> = None;
        let cells = input.trim().lines().enumerate().map(|(y, line)| 
            line.chars().enumerate().map(|(x, c)| match c {
                'S' => {
                    start = Some(Point(x, y));
                    0
                }
                'E' => {
                    target = Some(Point(x, y));
                    25
                }
                _ => {
                    (c as Elevation) - ('a' as Elevation)
                }
            }).collect()
        ).collect();

        ElevationMap {
            cells,
            start: start.unwrap(),
            target: target.unwrap()
        }
    }

    fn points(&self) -> impl Iterator<Item = Point> + '_ {
        self.cells.iter().enumerate().flat_map(move |(y, row)|
            row.iter().enumerate().map(move |(x, _)| 
                Point(x, y)
            )
        )
    }

    fn low_points(&self) -> impl Iterator<Item = Point> + '_ {
        self.points().filter(|p| self[p] == 0)
    }

    fn neighbours(&self, p: &Point) -> Vec<Point> {
        let mut ns = vec![];
        if p.0 > 0 { ns.push(Point(p.0 - 1, p.1)); }
        if p.1 > 0 { ns.push(Point(p.0, p.1 - 1)); }
        if p.0 < self.cells[0].len() - 1 { ns.push(Point(p.0 + 1, p.1)) }
        if p.1 < self.cells.len() - 1 { ns.push(Point(p.0, p.1 + 1)) }
        ns
    }

    fn dijkstra(&self, start: &Point) -> Option<Distance> {
        let mut unvisited: HashSet<Point> = HashSet::new();
        let mut dist: HashMap<Point, Distance> = HashMap::new();
        self.points().for_each(|p| {
            unvisited.insert(p);
            dist.insert(p, Distance::MAX);
        });
        dist.insert(*start, 0);

        fn unvisited_with_min_dist(
            unvisited: &HashSet<Point>, 
            dist: &HashMap<Point, Distance>
        ) -> (Option<Point>, Distance) {
            let mut p: Option<Point> = None;
            let mut d: Distance = Distance::MAX;
            unvisited.iter().for_each(|u| {
                if p.is_none() || dist[&u] < d {
                    p = Some(*u);
                    d = dist[&u];
                }
            });
            (p, d)
        }
        
        while !unvisited.is_empty() {
            let (u, ud) = unvisited_with_min_dist(&unvisited, &dist);
            if u.is_none() {
                return None;
            }
            let u = &u.unwrap();

            let hu = self[u];
            unvisited.remove(&u);
    
            self.neighbours(&u).iter().for_each(|n| {
                if self[n] - hu <= 1 && ud < dist[n] - 1 {
                    dist.insert(*n, ud + 1);
                }
            });
        }
    
        return Some(dist[&self.target]);
    }
}

impl Index<&Point> for ElevationMap {
    type Output = Elevation;

    fn index(&self, p: &Point) -> &Self::Output {
        return &self.cells[p.1][p.0];
    }
}

fn part1(input: &str) -> Option<Distance> {
    let map = ElevationMap::from(input);
    map.dijkstra(&map.start)
}

fn part2(input: &str) -> Option<Distance> {
    let map = ElevationMap::from(input);
    let mut min_distance = None;
    map.low_points().for_each(|lp| {
        let d = map.dijkstra(&lp);
        if d.is_some() && (min_distance.is_none() || d.unwrap() < min_distance.unwrap()) {
            min_distance = d;
        }
    });
    min_distance
}

fn main() {
    let input = std::fs::read_to_string("../input.txt")
        .expect("can't read input.txt");
    println!("Part 1: {:?}", part1(&input));
    println!("Part 2: {:?}", part2(&input));
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = r"Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi";

    #[test]
    fn test_parse() {
        let map = ElevationMap::from(&TEST_INPUT);
        assert_eq!(&map.cells, &vec![
            vec![0, 0, 1, 16, 15, 14, 13, 12],
            vec![0, 1, 2, 17, 24, 23, 23, 11],
            vec![0, 2, 2, 18, 25, 25, 23, 10],
            vec![0, 2, 2, 19, 20, 21, 22, 9],
            vec![0, 1, 3, 4, 5, 6, 7, 8]
        ]);
        assert_eq!(&map.start, &Point(0, 0));
        assert_eq!(&map.target, &Point(5, 2));
    }

    #[test]
    fn test_part1() {
        assert_eq!(part1(&TEST_INPUT), Some(31));
    }

    #[test]
    fn test_part2() {
        assert_eq!(part2(&TEST_INPUT), Some(29));
    }
}
