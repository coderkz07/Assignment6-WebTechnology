# Assignment 6: Party files

**Student:** Makanow Madiyar  
**Group:** IT 2515

A jQuery birthday-party investigation with two separate task pages.

- `task1/`: 20 selector and traversal cases, result counts, highlighting, guest jumps, adding Miras and removing Natasha.
- `task2/`: the same cases plus spotlight, guest details, animated room moves and arrival-time sorting.
- `report/Assignment6_Makanow_Madiyar.docx`: submission report.
- `report/Assignment6_Makanow_Madiyar.pdf`: PDF copy.
- `report/screenshots/`: actual browser screenshots for every case and the motion features.
- `report/case-results.json` and `report/motion-results.json`: observed browser results.

## Run locally

Open `index.html` in Microsoft Edge. All assets are local, so the site also works without an internet connection. Alternatively, from this folder run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Behavior

Every Task 1 case rebuilds the original party. Task 2 rebuilds from the current `PARTY` array, so moved guests remain in their new rooms. Cases 18 and 19 change the DOM for the current demonstration; the next case rebuilds it. Clear removes highlights and restores full opacity without undoing moves.

The data follows the assignment illustration: Arman is not an AITU student; Natasha is. Case 3 therefore has five matches. Case 13 has four matches. Zarina is the thief.

The project uses HTML, CSS and jQuery 3.7.1. There are no CSS transitions, CSS animations, inline event handlers or other behavior libraries. No build or package installation is required.

## Publish

Repository: https://github.com/coderkz07/Assignment6-WebTechnology

Upload the contents of this folder to the repository root. In repository Settings > Pages, choose **Deploy from a branch**, **main**, and **/(root)**. After GitHub Pages finishes, use the published URL shown there. Publication has not been completed from this workspace.

## Verification

All 20 selector results were checked in Chromium. All 11 checks in `report/motion-results.json` passed, including rapid sorting, rapid guest clicks and moves. At 390px wide, the document is 390px wide and all avatars load. Browser error collection returned no errors. Microsoft Edge testing remains pending because this chat's Windows browser connector could not initialize.

## Credits

- jQuery 3.7.1: MIT license; https://jquery.com/
- Open Peeps avatars via DiceBear: CC0; https://www.dicebear.com/styles/open-peeps/
- Guest names and room arrangement: provided Assignment 6 illustration.
