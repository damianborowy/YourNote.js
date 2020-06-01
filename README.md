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

Notatki mogą posiadać przypisane do siebie tagi, wyświetlane na dole notatki

![](https://github.com/damianborowy/e-Otis/blob/master/images/note%20tags.png)

Przy dodawaniu tagu wyświetla nam się okno dialogowe

![](https://github.com/damianborowy/e-Otis/blob/master/images/add%20tag.png)

Sprawdzana jest unikalność tagów, jako że notatka nie może posiadać dwóch tagów o takiej samej nazwie

![](https://github.com/damianborowy/e-Otis/blob/master/images/add%20tag%20error.png)

Dostępny jest też panel administracyjny do którego administrator może przejść przez menu boczne

![](https://github.com/damianborowy/e-Otis/blob/master/images/admin%20panel%20button.png)

Administrator ma podgląd na wszystkich zarejestrowanych użytkowników z podziałem na ich rolę

![](https://github.com/damianborowy/e-Otis/blob/master/images/admin%20panel.png)

Administrator może zmienić rolę innych użytkowników, usunąć ich lub dodać nowego użytkownika

![](https://github.com/damianborowy/e-Otis/blob/master/images/role%20change.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/delete%20user.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/add%20new%20user.png)

Istnieje możliwość filtrowania notatek po kolorze i przez sprawdzenie, czy tytuł, treść lub tagi notatki zawierają określony tekst

![](https://github.com/damianborowy/e-Otis/blob/master/images/filter.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/filter%20green.png)

Pobieranie notatek jako PDF połączone z filtrowaniem notatek, tj. pobrane zostaną tylko przefiltrowane notatki (lub wszystkie w przypadku braku nałożonych filtrów)

![](https://github.com/damianborowy/e-Otis/blob/master/images/save%20as%20pdf.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/pdf.png)

Dodawanie załączników do notatek

![](https://github.com/damianborowy/e-Otis/blob/master/images/attachments%20dialog.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/attachments%20new.png)

Błąd w przypadku dodania istniejącej już notatki, przekroczenia maksymalnego dopuszczalnego rozmiaru pliku lub błędu po stronie serwera. Plik nie zostaje wtedy dodany i można go usunąć z listy ręcznie, lub sam usunie się w momencie odświeżenia strony.

![](https://github.com/damianborowy/e-Otis/blob/master/images/attachments%20error.png)

Dodano możliwość przesuwania notatek metodą drag 'n drop

![](https://github.com/damianborowy/e-Otis/blob/master/images/drag%20first.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/drag%20second.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/drag%20third.png)

Zaktualizowany został widok notatki, uwzględnia on teraz ilość załączników i tagów

![](https://github.com/damianborowy/e-Otis/blob/master/images/new%20note.png)

Zaimplementowana została funkcjonalność pozwalająca na zmianę kolejności notatek i kategoryzowanie ich we własnych widokach

![](https://github.com/damianborowy/e-Otis/blob/master/images/views.png)

Notatkę możemy dodać do innego widoku lub ukryć ją w danym widoku przez nowe menu

![](https://github.com/damianborowy/e-Otis/blob/master/images/note%20view%20menu.png)

Możliwa jest również zmiana nazwy widoku lub usunięcie go

![](https://github.com/damianborowy/e-Otis/blob/master/images/view%20settings.png)

Podzielono panel administracyjny na dwie sekcje, wcześniej istniejącą sekcję użytkowników i nową sekcję zawierającą statystyki

![](https://github.com/damianborowy/e-Otis/blob/master/images/admin%20tabs.png)

Statystyki dzielą się na takie dotyczące użycia przez wszystkich użytkowników konkretnych kolorów dla notatek oraz dotyczące dziesięciu najpopularniejszych tagów używanych przez użytkowników

![](https://github.com/damianborowy/e-Otis/blob/master/images/stats%20colors.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/stats%20tags.png)

Dodano wsparcie dla wielu języków

![](https://github.com/damianborowy/e-Otis/blob/master/images/lang%20change.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/lang%20list.png)
![](https://github.com/damianborowy/e-Otis/blob/master/images/lang%20new.png)
