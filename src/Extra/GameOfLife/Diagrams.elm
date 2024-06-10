module Extra.GameOfLife.Diagrams exposing (..)

import Html.Styled exposing (Html)
import Set exposing (..)
import Svg.Styled exposing (circle, g, path, svg, text, text_)
import Svg.Styled.Attributes exposing (cx, cy, d, dominantBaseline, fontFamily, fontSize, height, preserveAspectRatio, r, stroke, strokeLinejoin, strokeWidth, textAnchor, transform, viewBox, width, x, y)


nearDiagram : Html msg
nearDiagram =
    svg [ width "100%", viewBox "0 .02 1 .39", preserveAspectRatio "meet" ]
        [ diagramText "0.45" "0.09" "near"
        , cellGrid ( 0.55, 0.09 ) 5 5 (Set.fromList [ ( 2, 2 ) ])
        , cellGrid ( 0.5, 0.34 ) 5 5 (Set.fromList [ ( 1, 1 ), ( 1, 2 ), ( 1, 3 ), ( 2, 1 ), ( 2, 2 ), ( 2, 3 ), ( 3, 1 ), ( 3, 2 ), ( 3, 3 ) ])
        , arrow 0.23
        ]


cellsToCheckDiagram : Html msg
cellsToCheckDiagram =
    let
        line1 =
            g [ transform "translate(0.04 0.04)" ]
                [ diagramText "0.4" "0.235" "foldl (near >> union) empty"
                , cellGrid ( 0.69, 0.235 ) 5 5 (Set.fromList [ ( 1, 2 ), ( 1, 1 ), ( 2, 2 ) ])
                ]

        line2 =
            g []
                [ diagramText "0.16" ".49" "(near"
                , diagramText "0.39" ".49" ") ∪ (near"
                , diagramText "0.66" ".49" ") ∪ (near"
                , diagramText "0.86" ".49" ")"
                , cellGrid ( 0.26, 0.49 ) 5 5 (Set.fromList [ ( 1, 1 ) ])
                , cellGrid ( 0.53, 0.49 ) 5 5 (Set.fromList [ ( 1, 2 ) ])
                , cellGrid ( 0.8, 0.49 ) 5 5 (Set.fromList [ ( 2, 2 ) ])
                ]

        line3 =
            g [ transform "translate(0 .25)" ]
                [ diagramText "0.4" ".49" "∪"
                , diagramText "0.6" ".49" "∪"
                , cellGrid ( 0.3, 0.49 ) 5 5 (Set.fromList [ ( 0, 0 ), ( 0, 1 ), ( 0, 2 ), ( 1, 0 ), ( 1, 1 ), ( 1, 2 ), ( 2, 0 ), ( 2, 1 ), ( 2, 2 ) ])
                , cellGrid ( 0.5, 0.49 ) 5 5 (Set.fromList [ ( 0, 1 ), ( 0, 2 ), ( 0, 3 ), ( 1, 1 ), ( 1, 2 ), ( 1, 3 ), ( 2, 1 ), ( 2, 2 ), ( 2, 3 ) ])
                , cellGrid ( 0.7, 0.49 ) 5 5 (Set.fromList [ ( 1, 1 ), ( 1, 2 ), ( 1, 3 ), ( 2, 1 ), ( 2, 2 ), ( 2, 3 ), ( 3, 1 ), ( 3, 2 ), ( 3, 3 ) ])
                ]
    in
    svg [ width "100%", viewBox "0 0.22 1 0.83", preserveAspectRatio "meet" ]
        [ line1
        , arrow 0.38
        , line2
        , arrow 0.63
        , line3
        , arrow 0.87
        , cellGrid ( 0.5, 0.98 ) 5 5 (Set.fromList [ ( 0, 0 ), ( 1, 0 ), ( 2, 0 ), ( 0, 3 ), ( 0, 1 ), ( 0, 2 ), ( 1, 1 ), ( 1, 2 ), ( 1, 3 ), ( 2, 1 ), ( 2, 2 ), ( 2, 3 ), ( 3, 1 ), ( 3, 2 ), ( 3, 3 ) ])
        ]


livingNeighborsDiagram : Html msg
livingNeighborsDiagram =
    let
        line1 =
            g []
                [ diagramText ".5" ".1" "board ∩ ((near cell) - cell)"
                ]

        line2 =
            g [ transform "translate (-0.02 .2)" ]
                [ diagramText ".44" ".09" "∩ ((near"
                , diagramText ".64" ".09" ") -"
                , diagramText ".79" ".09" ")"
                , cellGrid ( 0.3, 0.09 ) 5 5 (Set.fromList [ ( 1, 0 ), ( 1, 1 ), ( 3, 3 ), ( 4, 0 ), ( 2, 2 ) ])
                , cellGrid ( 0.56, 0.09 ) 5 5 (Set.fromList [ ( 2, 2 ) ])
                , cellGrid ( 0.73, 0.09 ) 5 5 (Set.fromList [ ( 2, 2 ) ])
                ]

        line3 =
            g [ transform "translate (0 .42)" ]
                [ diagramText ".44" ".09" "∩ ("
                , diagramText ".6" ".09" " -"
                , diagramText ".74" ".09" ")"
                , cellGrid ( 0.34, 0.09 ) 5 5 (Set.fromList [ ( 1, 0 ), ( 1, 1 ), ( 3, 3 ), ( 4, 0 ), ( 2, 2 ) ])
                , cellGrid ( 0.52, 0.09 ) 5 5 (Set.fromList [ ( 1, 1 ), ( 1, 2 ), ( 1, 3 ), ( 2, 1 ), ( 2, 2 ), ( 2, 3 ), ( 3, 1 ), ( 3, 2 ), ( 3, 3 ) ])
                , cellGrid ( 0.68, 0.09 ) 5 5 (Set.fromList [ ( 2, 2 ) ])
                ]

        line4 =
            g [ transform "translate (0 .63)" ]
                [ diagramText ".5" ".09" "∩"
                , cellGrid ( 0.4, 0.09 ) 5 5 (Set.fromList [ ( 1, 0 ), ( 1, 1 ), ( 3, 3 ), ( 4, 0 ), ( 2, 2 ) ])
                , cellGrid ( 0.6, 0.09 ) 5 5 (Set.fromList [ ( 1, 1 ), ( 1, 2 ), ( 1, 3 ), ( 2, 1 ), ( 2, 3 ), ( 3, 1 ), ( 3, 2 ), ( 3, 3 ) ])
                ]
    in
    svg [ width "100%", viewBox "0 .06 1 .96", preserveAspectRatio "meet" ]
        [ line1
        , arrow 0.19
        , line2
        , arrow 0.41
        , line3
        , arrow 0.63
        , line4
        , arrow 0.86
        , cellGrid ( 0.5, 0.95 ) 5 5 (Set.fromList [ ( 1, 1 ), ( 1, 2 ), ( 1, 3 ), ( 2, 1 ), ( 2, 2 ), ( 2, 3 ), ( 3, 1 ), ( 3, 2 ), ( 3, 3 ) ])
        ]


diagramText : String -> String -> String -> Svg.Styled.Svg msg
diagramText xVal yVal content =
    text_ [ x xVal, y yVal, fontSize ".028", fontFamily "courier", dominantBaseline "central", textAnchor "middle" ] [ text content ]


drawCell : Bool -> ( Float, Float ) -> Svg.Styled.Svg msg
drawCell alive ( x, y ) =
    circle
        [ cx (String.fromFloat x)
        , cy (String.fromFloat y)
        , r
            (if alive then
                "0.007"

             else
                "0.001"
            )
        ]
        []


cartesian : List a -> List b -> List ( a, b )
cartesian xs ys =
    List.concatMap
        (\x -> List.map (\y -> ( x, y )) ys)
        xs


spacing : Float
spacing =
    0.017


cellGrid : ( Float, Float ) -> Int -> Int -> Set ( Int, Int ) -> Svg.Styled.Svg msg
cellGrid ( xCenter, yCenter ) width height cells =
    g
        []
        (List.map
            (\( x, y ) ->
                drawCell
                    (member ( x, y ) cells)
                    ( xCenter - 0.5 * (toFloat width - 1) * spacing + spacing * toFloat x, yCenter - 0.5 * (toFloat height - 1) * spacing + spacing * toFloat y )
            )
            (cartesian (List.range 0 (width - 1)) (List.range 0 (height - 1)))
        )


arrow : Float -> Svg.Styled.Svg msg
arrow yPos =
    path [ d ("m.5" ++ String.fromFloat yPos ++ "5v-.04zl.012-.012zl-.012-.012z"), stroke "black", strokeWidth ".003", strokeLinejoin "round" ] []
