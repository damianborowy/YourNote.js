# e-Otis

e-Otis to aplikacja oparta o Node.js umożliwiająca zarządzanie notatkami

## Instalacja

Wymagane narzędzia

-   [Node](https://nodejs.org/en/)
-   [Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable)

Najpierw trzeba pobrać moduły potrzebne do działania aplikacji, w tym celu z poziomu obu katalogów (_/client_, _/server_) wystarczy wywołać polecenie **yarn upgrade**.

## Uruchomienie

Należy uruchomić dwa serwery, oddzielnie dla klienta i serwera. Znów znajdując się w konkretnym katalogu należy wpisać jedno polecenie - **yarn start**.

## Funkcjonalności

Logowanie

![](https://github.com/damianborowy/e-otis/blob/master/images/login.png)

Rejestracja

![](https://github.com/damianborowy/e-otis/blob/master/images/register.png)

Wyświetlanie notatek z podziałem na notatki własne i udostępnione

![](https://github.com/damianborowy/e-otis/blob/master/images/main.png)

Dodawanie nowej notatki i edycja istniejącej - zmiana przebiega w takim samym ekranie, ale odnosi się do już istniejąceej notatki do której użytkownik ma uprawnienia.
Usuwanie jest realizowane poprzez wciśnięcie ikonki kosza na śmieci na stworzonej notatce.

![](https://github.com/damianborowy/e-otis/blob/master/images/note%20edit.png)

Udostępnianie notatki poprzez publiczny link

![](https://github.com/damianborowy/e-otis/blob/master/images/share%20public.png)

Publicznie dostępna notatka

![](https://github.com/damianborowy/e-otis/blob/master/images/public%20note.png)

Ciemny i jasny motyw

![](https://github.com/damianborowy/e-otis/blob/master/images/dark%20theme.png)
![](https://github.com/damianborowy/e-otis/blob/master/images/light%20theme.png)

Udostępnianie notatek innym użytkownikom

![](https://github.com/damianborowy/e-otis/blob/master/images/share%20menu.png)
![](https://github.com/damianborowy/e-otis/blob/master/images/share%20to%20user.png)

W przypadku użycia adresu email, który jest niewłaściwy, nie istnieje w bazie bądź jest naszym własnym adresem email pojawi się komunikat o podaniu błędnego adresu email

![](https://github.com/damianborowy/e-Otis/blob/master/images/share%20to%20user%20error.png)

Po podaniu właściwego adresu można podać kolejny, a dodany użytkownik ma dostęp do notatki w sekcji współdzielonych notatek

![](https://github.com/damianborowy/e-Otis/blob/master/images/shared%20to%20user.png)

Zmiana koloru notatki

![](https://github.com/damianborowy/e-Otis/blob/master/images/green%20note.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/blue%20note.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/red%20note.png)
