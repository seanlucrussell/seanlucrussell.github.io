module Main exposing (main)

import Browser exposing (UrlRequest(..))
import Sitewide.Init exposing (init)
import Sitewide.Types exposing (..)
import Sitewide.Update exposing (update)
import Sitewide.View exposing (view)



-- start with
-- elm-live -p 8001 --pushstate src/Main.elm


main : Program () SitewideModel SitewideMsg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = always Sub.none
        , onUrlRequest = UrlRequest
        , onUrlChange = UrlChange
        }
