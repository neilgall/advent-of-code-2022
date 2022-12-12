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

    fn neighbours(&self, p: Point) -> NeighbourIterator<'_> {
        return NeighbourIterator::new(&self, p);
    }

    fn dijkstra(&self, start: &Point) -> Option<Distance> {
        let mut unvisited: HashSet<Point> = self.points().collect();
        let mut dist = DistanceMap::new();
        dist.insert(*start, 0);

        while !unvisited.is_empty() {
            let u = unvisited.iter().min_by_key(|u| dist[&u]);
            if u.is_none() {
                return None;
            }
            let u: Point = *u.unwrap();
            let ud = dist[&u];
            let hu = self[&u];

            unvisited.remove(&u);
            self.neighbours(u).for_each(|n| {
                let nd = dist[&n];
                if self[&n] - hu <= 1 && ud < nd - 1 {
                    dist.insert(n, ud + 1);
                }
            });
        }
    
        return Some(dist[&self.target])
    }
}

impl Index<&Point> for ElevationMap {
    type Output = Elevation;

    fn index(&self, p: &Point) -> &Self::Output {
        return &self.cells[p.1][p.0];
    }
}

struct DistanceMap(HashMap<Point, Distance>);

impl DistanceMap {
    fn new() -> Self {
        Self(HashMap::new())
    }

    fn insert(&mut self, p: Point, d: Distance) {
        self.0.insert(p, d);
    }
}

impl Index<&Point> for DistanceMap {
    type Output = Distance;

    fn index(&self, p: &Point) -> &Self::Output {
        self.0.get(p).unwrap_or(&Distance::MAX)
    }
}

struct NeighbourIterator<'a> {
    map: &'a ElevationMap,
    p: Point,
    i: usize
}

impl<'a> NeighbourIterator<'a> {
    fn new(map: &'a ElevationMap, p: Point) -> Self {
        NeighbourIterator {
            map,
            p,
            i: 0
        }
    }
}

impl<'a> Iterator for NeighbourIterator<'a> {
    type Item = Point;

    fn next(&mut self) -> Option<Self::Item> {
        while self.i < 4 {
            let i = self.i;
            self.i += 1;
            match i {
                0 if self.p.0 > 0 => {
                    return Some(Point(self.p.0 - 1, self.p.1));
                }
                1 if self.p.1 > 0 => { 
                    return Some(Point(self.p.0, self.p.1 - 1));
                }
                2 if self.p.0 < self.map.cells[0].len() - 1 => { 
                    return Some(Point(self.p.0 + 1, self.p.1));
                }
                3 if self.p.1 < self.map.cells.len() - 1 => { 
                    return Some(Point(self.p.0, self.p.1 + 1));
                }
                _ => {}
            }
        }
        None
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
