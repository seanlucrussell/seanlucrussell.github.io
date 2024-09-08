module Pages.Test exposing (..)

import Html.Styled exposing (div, li)
import List exposing (concatMap, drop, filter, foldl, foldr, head, length, map, map2, map3, map4, map5, member, range, reverse, sum, take)
import Maybe exposing (withDefault)
import Result exposing (fromMaybe)
import Set exposing (empty, fromList)
import Sitewide.Types exposing (Page, SitewideMsg(..))
import String exposing (fromFloat, fromInt)
import Svg.Styled exposing (Svg, circle, g, line, path, polygon, svg, text, text_)
import Svg.Styled.Attributes exposing (cx, cy, d, fill, fillOpacity, r, stroke, strokeOpacity, strokeWidth, style, transform, viewBox, x, x1, x2, y, y1, y2)
import Tuple exposing (first, second)


page : Page
page =
    { update =
        \msg b ->
            case msg of
                GameOfLifeStep ->
                    -- ( { b | testModel = map rotation b.testModel }, Cmd.none )
                    ( { b | testModel = repeat 50 evolve b.testModel }, Cmd.none )

                _ ->
                    ( b, Cmd.none )
    , view =
        \model ->
            div []
                [ svg [ viewBox "0 0 100 100" ] (plotComplexGrid model.testModel)
                , svg [ viewBox "0 0 100 100" ] sampleGraphic
                , svg [ viewBox "0 0 100 100" ] sampleGraphic2
                , viewNetwork
                , svg [ viewBox "0 0 100 100" ]
                    (drawTree (numToTree 14) 25 50 20)
                ]
    }


repeat : Int -> (a -> a) -> a -> a
repeat n f x =
    if n == 0 then
        x

    else
        repeat (n - 1) f (f x)


type alias Complex =
    ( Float, Float )


neg : Complex -> Complex
neg n =
    mult ( -1, 0 ) n


add : Complex -> Complex -> Complex
add n m =
    let
        ( ( a, b ), ( c, d ) ) =
            ( n, m )
    in
    ( a + c, b + d )


mult : Complex -> Complex -> Complex
mult n m =
    let
        ( ( a, b ), ( c, d ) ) =
            ( n, m )
    in
    ( a * c - b * d, a * d + b * c )


rot : Int -> List a -> List a
rot n l =
    drop n l ++ take n l


type alias Matrix a =
    Int -> Int -> a


type alias Vector a =
    Int -> a



-- would be way easier to implement this via matrix product


rotateList : Int -> List a -> Maybe a
rotateList n =
    drop n >> head


evolve : List Complex -> List Complex
evolve ls =
    let
        theta =
            0.003
    in
    normalize
        (map
            (\i ->
                foldl add
                    ( 0, 0 )
                    (map2 (\j v -> mult (withDefault ( 0, 0 ) (rotateList (modBy (length ls) (i + j)) ls)) v)
                        (map
                            (if modBy 2 i == 0 then
                                identity

                             else
                                negate
                            )
                            [ -1, 0, 1, 2 ]
                        )
                        [ ( 0, sin (2 * theta) / 2 ), ( cos theta ^ 2, 0 ), ( 0, sin (2 * theta) / 2 ), ( -(sin theta ^ 2), 0 ) ]
                    )
            )
            (range 0 (length ls - 1))
        )


normalize : List Complex -> List Complex
normalize l =
    let
        amp =
            sum (map amplitude l)
    in
    map (mult ( 1 / amp, 0 )) l


initialComplexList : List Complex
initialComplexList =
    normalize (planeWave 16)


planeWave : Int -> List Complex
planeWave n =
    let
        k =
            pi / 8
    in
    map (\x -> ( cos (k * toFloat x), sin (k * toFloat x) )) (range 0 (n - 1))


plotComplexGrid : List Complex -> List (Svg msg)
plotComplexGrid numbers =
    let
        spacing =
            5
    in
    List.concat (map2 (\i n -> cvis n ( (50 - (spacing / 2) * Basics.toFloat (length numbers - 1)) + Basics.toFloat i * spacing, 50 )) (range 0 (length numbers - 1)) numbers)


sampleComplexThing : List (Svg msg)
sampleComplexThing =
    plotComplexGrid initialComplexList


amplitude : Complex -> Float
amplitude n =
    let
        ( a, b ) =
            n
    in
    sqrt (a * a + b * b)


cvis : Complex -> ( Float, Float ) -> List (Svg msg)
cvis n coords =
    let
        ( ( a, b ), ( x, y ) ) =
            ( n, coords )

        ampVisualStrength =
            5 * amplitude n

        d =
            8
    in
    [ g [ transform ("translate(" ++ fromFloat x ++ " " ++ fromFloat y ++ ") scale(" ++ fromFloat ampVisualStrength ++ ")") ]
        [ circle [ cx "0", cy "0", r (fromFloat d), stroke "black", fill "none", strokeWidth "0.1" ] []
        , circle [ cx "0", cy "0", r (fromFloat (d / 4)) ] []
        , line
            [ x1 "0"
            , y1 "0"
            , x2 (fromFloat (d * a / amplitude n))
            , y2 (fromFloat (d * b / amplitude n))
            , stroke "black"
            , strokeWidth "1"
            ]
            []
        ]
    ]



-- don't need coordinate map if edge renderer is generated given coordinate map


cartesianProduct : List a -> List b -> List ( a, b )
cartesianProduct la lb =
    concatMap (\x -> map (\y -> ( x, y )) lb) la


testIndicator : Int -> Int -> Bool
testIndicator x y =
    modBy x y == 0


circleCoordinateMap : Float -> Int -> Int -> ( Float, Float )
circleCoordinateMap scale m n =
    let
        angle =
            2 * pi * toFloat n / toFloat m
    in
    ( 50 + scale * cos angle, 50 - scale * sin angle )


testVertexRenderer : (Int -> ( Float, Float )) -> Int -> List (Svg msg)
testVertexRenderer coordinateMap n =
    -- []
    [ text_ [ x (fromFloat (first (coordinateMap n))), y (fromFloat (second (coordinateMap n))), Svg.Styled.Attributes.textAnchor "middle", style "font-size: 1.3" ] [ text (fromInt n) ] ]


sampleGraphic : List (Svg msg)
sampleGraphic =
    let
        top =
            50
    in
    drawGraph (range 2 top) (testVertexRenderer (circleCoordinateMap 47 (top - 1))) (renderEdge testIndicator (circleCoordinateMap 45 (top - 1)))


sampleGraphic2 : List (Svg msg)
sampleGraphic2 =
    let
        top =
            150
    in
    drawGraph (range 2 (3 * top)) (testVertexRenderer (circleCoordinateMap 47 (top - 1))) (renderEdge testIndicator (circleCoordinateMap 49 (top - 1)))


renderEdge : (v -> v -> Bool) -> (v -> ( Float, Float )) -> v -> v -> List (Svg msg)
renderEdge graphIndicator coordinateMap startVertex endVertex =
    if graphIndicator startVertex endVertex then
        [ ln (coordinateMap startVertex) (coordinateMap endVertex) ]

    else
        []


drawGraph : List v -> (v -> List (Svg msg)) -> (v -> v -> List (Svg msg)) -> List (Svg msg)
drawGraph vertexIterator vertexRenderer edgeRenderer =
    concatMap vertexRenderer vertexIterator ++ concatMap (\( start, end ) -> edgeRenderer start end) (cartesianProduct vertexIterator vertexIterator)


type alias Network =
    List ( Int, Int )


type alias CoordinateList =
    List ( Float, Float )


viewNetwork : Svg SitewideMsg
viewNetwork =
    svg [ viewBox "0 0 100 100" ]
        (map (\( x, y ) -> drawConnection x y) allConnections)


drawConnection : Int -> Int -> Svg SitewideMsg
drawConnection start end =
    ln (coordinates start) (coordinates end)


connectionsList : List (List Int)
connectionsList =
    [ [ 1, 0 ], [ 1, 4 ], [ 2, 4 ], [ 1, 2 ], [ 3, 4 ], [ 1, 3 ] ]


coordinatesList : List ( Float, Float )
coordinatesList =
    [ ( 55, 23 ), ( 43, 12 ), ( 93, 23 ), ( 77, 77 ), ( 54, 45 ) ]


allConnections : List ( Int, Int )
allConnections =
    filter (\( x, y ) -> connected x y) allNodePairs


allNodePairs : List ( Int, Int )
allNodePairs =
    concatMap (\x -> map (\y -> ( x, y )) indices) indices


energy : Float
energy =
    sum
        -- if nodes are connected, their energy is a function of their distance that is minimized when they are at the ideal distance
        -- if nodes are disconnected, their energy is a function of their distance that is minimized when they are farther apart
        (map
            (\( x, y ) ->
                if connected x y then
                    (5 - dist (coordinates x) (coordinates y)) ^ 2

                else
                    dist (coordinates x) (coordinates y)
            )
            allNodePairs
        )


connected : Int -> Int -> Bool
connected n m =
    member (fromList [ n, m ]) (map fromList connectionsList)


indices : List Int
indices =
    range 0 (length coordinatesList)


coordinates : Int -> ( Float, Float )
coordinates n =
    withDefault ( 0, 0 ) (head (drop n coordinatesList))



-- a graph is a pair of functions from some index set A
-- connected : A -> A -> Bool
-- coordinates : A -> (Float, Float)
-- perhaps for utilities sake we also have a way to iterate the indexed set, aka a list


ln : ( Float, Float ) -> ( Float, Float ) -> Svg msg
ln start end =
    line
        [ x1 (String.fromFloat (first start))
        , y1 (String.fromFloat (second start))
        , x2 (String.fromFloat (first end))
        , y2 (String.fromFloat (second end))
        , stroke "black"
        , strokeWidth "0.1"
        ]
        []


rln sx sy len =
    ln ( sx, sy ) ( sx + len, sy + len )


lln sx sy len =
    ln ( sx, sy ) ( sx - len, sy + len )


type BinTree
    = L
    | B BinTree BinTree


numToTree : Int -> BinTree
numToTree n =
    case n of
        0 ->
            L

        1 ->
            B L L

        _ ->
            B (numToTree (n - 1)) (numToTree (n - 2))


drawTree : BinTree -> Float -> Float -> Float -> List (Svg msg)
drawTree tree len x y =
    case tree of
        L ->
            []

        B l r ->
            [ rln x y len, lln x y len ] ++ drawTree l (len * 0.4) (x - len) (y + len) ++ drawTree r (len * 0.4) (x + len) (y + len)



-- forceBetween a b =
--     0.001 * (10 - dist a b)


dist a b =
    sqrt (first a * first b + second a * second b)



-- direction a b =
--     ( (first a - first b) / dist a b, (second a - second b) / dist a b )
-- singleConnectionUpdate a b =
--     let
--         force =
--             forceBetween a b
--         updateDirection =
--             direction a b
--     in
--     ( first a + force * first updateDirection, second a + force * second updateDirection )
-- findPartnerIndices i conns =
--     map
--         (\( a, b ) ->
--             if a == i then
--                 a + b
--             else
--                 a
--         )
--         (filter (\( a, b ) -> a == i || a + b == i) conns)
-- catMaybes : List (Maybe a) -> List a
-- catMaybes l =
--     case l of
--         [] ->
--             []
--         Nothing :: ls ->
--             catMaybes ls
--         (Just x) :: ls ->
--             x :: catMaybes ls
-- updateSingleNode i conns coords =
--     let
--         coord =
--             head (drop i coords)
--     in
--     Maybe.map (\c -> foldr (\a b -> singleConnectionUpdate b a) c (catMaybes (map (\idex -> head (drop idex coords)) (findPartnerIndices i conns)))) coord
-- update : Network -> CoordinateList -> CoordinateList
-- update a b =
--     b
