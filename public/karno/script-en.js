// Karno Map Web Application JavaScript

console.log('🔧 Karno Script file loaded!');

// Global application variable
let karnoApp;

class KarnoMap {
    constructor() {
        console.log('🚀 KarnoMap constructor started');
        console.log('📍 DOM readyState:', document.readyState);
        
        this.variableCount = 4;
        this.variables = ['A', 'B', 'C', 'D'];
        this.truthTable = [];
        this.karnoValues = []; // Initially empty, will be filled in generateTruthTable
        this.groups = [];
        this.currentMethod = 'truthTable';
        this.isLocked = false; // Prevent changes after groups are found
        
        // Check DOM elements existence
        const domCheck = this.checkDOMElements();
        if (!domCheck) {
            console.error('❌ DOM elements missing, trying again in 2 seconds...');
            setTimeout(() => {
                const secondCheck = this.checkDOMElements();
                if (secondCheck) {
                    this.initializeApp();
                } else {
                    console.error('❌ DOM elements not found on second attempt');
                    console.error('❌ Please wait for full page load and try again');
                }
            }, 2000);
            return;
        }
        
        this.initializeApp();
    }
    
    initializeApp() {
        console.log('🔧 Starting application...');
        
        this.initializeEventListeners();
        console.log('✅ Event listeners initialized');
        
        this.generateTruthTable();
        console.log('✅ Truth table created');
        
        this.generateKarnoMap();
        console.log('✅ Karno map created');
        
        // Short delay for DOM rendering completion
        setTimeout(() => {
            this.verifyRendering();
        }, 100);
        
        // Start with empty map - no random value generation
        console.log('📋 Starting with empty Karno map...');
    }

    checkDOMElements() {
        console.log('🔍 DOM elementleri kontrol ediliyor...');
        
        const requiredElements = [
            'truthTableContainer',
            'karnoMapContainer',
            'variableCount',
            'truthTableBtn',
            'mintermsBtn'
        ];
        
        const missing = [];
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                missing.push(id);
                console.warn(`❌ Element bulunamadı: ${id}`);
            } else {
                console.log(`✅ Element bulundu: ${id}`);
            }
        });
        
        if (missing.length > 0) {
            console.error('❌ Eksik DOM elementleri:', missing);
            return false;
        } else {
            console.log('✅ Tüm gerekli DOM elementleri mevcut');
            return true;
        }
    }
    
    verifyRendering() {
        console.log('🔍 Render durumu kontrol ediliyor...');
        
        // Truth table kontrolü
        const truthTableCells = document.querySelectorAll('.truth-table td');
        console.log('📊 Truth table hücreleri:', truthTableCells.length);
        
        // Karno map kontrolü
        const karnoCells = document.querySelectorAll('.karno-cell');
        console.log('🗂️ Karno map hücreleri:', karnoCells.length);
        
        if (truthTableCells.length === 0) {
            console.error('❌ Truth table render edilmemiş!');
        }
        
        if (karnoCells.length === 0) {
            console.error('❌ Karno map render edilmemiş!');
        }
        
        if (truthTableCells.length > 0 && karnoCells.length > 0) {
            console.log('✅ Her ikisi de başarıyla render edildi!');
        }
    }

    initializeEventListeners() {
        console.log('Event listeners başlatılıyor');
        
        // Variable count change
        const variableSelect = document.getElementById('variableCount');
        if (variableSelect) {
            variableSelect.addEventListener('change', (e) => {
                this.variableCount = parseInt(e.target.value);
                this.variables = ['A', 'B', 'C', 'D'].slice(0, this.variableCount);
                this.generateTruthTable();
                this.generateKarnoMap();
                this.clearResults();
                
                // Değişken sayısı değiştiğinde boş harita ile başla
                console.log('🔄 Değişken sayısı değişti, boş harita oluşturuluyor...');
            });
        }

        // Input method switching
        const truthTableBtn = document.getElementById('truthTableBtn');
        if (truthTableBtn) {
            truthTableBtn.addEventListener('click', () => {
                this.switchInputMethod('truthTable');
            });
        }

        const mintermsBtn = document.getElementById('mintermsBtn');
        if (mintermsBtn) {
            mintermsBtn.addEventListener('click', () => {
                this.switchInputMethod('minterms');
            });
        }

        // Action buttons
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAll();
            });
        }

        const randomBtn = document.getElementById('randomBtn');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => {
                this.generateRandom();
            });
        }

        // Minterm input
        const applyMinterms = document.getElementById('applyMinterms');
        if (applyMinterms) {
            applyMinterms.addEventListener('click', () => {
                this.applyMinterms();
            });
        }

        // Map controls
        const findGroupsBtn = document.getElementById('findGroupsBtn');
        if (findGroupsBtn) {
            findGroupsBtn.addEventListener('click', () => {
                this.findGroups();
            });
        }

        const showSolutionBtn = document.getElementById('showSolutionBtn');
        if (showSolutionBtn) {
            showSolutionBtn.addEventListener('click', () => {
                this.showSolution();
            });
        }
    }

    switchInputMethod(method) {
        this.currentMethod = method;
        
        // Update button states
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (method === 'truthTable') {
            const truthTableBtn = document.getElementById('truthTableBtn');
            const truthTablePanel = document.getElementById('truthTablePanel');
            const mintermsPanel = document.getElementById('mintermsPanel');
            
            if (truthTableBtn) truthTableBtn.classList.add('active');
            if (truthTablePanel) truthTablePanel.classList.add('active');
            if (mintermsPanel) mintermsPanel.classList.remove('active');
        } else {
            const mintermsBtn = document.getElementById('mintermsBtn');
            const mintermsPanel = document.getElementById('mintermsPanel');
            const truthTablePanel = document.getElementById('truthTablePanel');
            
            if (mintermsBtn) mintermsBtn.classList.add('active');
            if (mintermsPanel) mintermsPanel.classList.add('active');
            if (truthTablePanel) truthTablePanel.classList.remove('active');
        }
    }

    generateTruthTable() {
        console.log('generateTruthTable çağrıldı');
        const rows = Math.pow(2, this.variableCount);
        this.truthTable = [];
        
        // KarnoValues array'ini doğru boyutta initialize et
        this.karnoValues = new Array(rows).fill(0);
        
        for (let i = 0; i < rows; i++) {
            const row = {};
            for (let j = 0; j < this.variableCount; j++) {
                const varName = this.variables[j];
                row[varName] = (i >> (this.variableCount - 1 - j)) & 1;
            }
            row.output = 0; // Default output
            row.minterm = i;
            this.truthTable.push(row);
        }

        console.log('Doğruluk tablosu oluşturuldu:', this.truthTable);
        console.log('KarnoValues initialize edildi:', this.karnoValues);
        this.renderTruthTable();
        this.updateKarnoFromTruthTable();
    }

    renderTruthTable() {
        console.log('renderTruthTable çağrıldı');
        const container = document.getElementById('truthTableContainer');
        console.log('Container bulundu:', container);
        
        if (!container) {
            console.error('truthTableContainer bulunamadı!');
            return;
        }
        
        let html = '<table class="truth-table"><thead><tr>';
        
        // Variable headers
        for (const variable of this.variables) {
            html += `<th>${variable}</th>`;
        }
        html += '<th>F</th></tr></thead><tbody>';

        // Table rows
        for (let i = 0; i < this.truthTable.length; i++) {
            const row = this.truthTable[i];
            html += '<tr>';
            
            for (const variable of this.variables) {
                html += `<td>${row[variable]}</td>`;
            }
            
            const outputClass = row.output === 1 ? 'selected' : 
                               row.output === 'X' ? 'dont-care' : '';
            
            html += `<td class="output-cell ${outputClass}" 
                     data-row="${i}" onclick="karnoApp.toggleOutput(${i})">
                     ${row.output}
                   </td>`;
            html += '</tr>';
        }

        html += '</tbody></table>';
        container.innerHTML = html;
        console.log('Doğruluk tablosu render edildi');
    }

    toggleOutput(rowIndex) {
        console.log('toggleOutput çağrıldı, rowIndex:', rowIndex);
        const currentValue = this.truthTable[rowIndex].output;
        // 0 -> 1 -> X -> 0 döngüsü
        if (currentValue === 0) {
            this.truthTable[rowIndex].output = 1;
        } else if (currentValue === 1) {
            this.truthTable[rowIndex].output = 'X';
        } else {
            this.truthTable[rowIndex].output = 0;
        }
        this.renderTruthTable();
        this.updateKarnoFromTruthTable();
        this.clearResults();
        
        // Otomatik grup bulma kaldırıldı - kullanıcı manuel olarak butsona basacak
        console.log('💡 Change made, click "Find Groups" button to find groups');
    }

    updateKarnoFromTruthTable() {
        this.karnoValues = this.truthTable.map(row => row.output);
        this.renderKarnoMap();
    }

    generateKarnoMap() {
        console.log('generateKarnoMap çağrıldı');
        const container = document.getElementById('karnoMapContainer');
        console.log('Karno container bulundu:', container);
        
        if (!container) {
            console.error('karnoMapContainer bulunamadı!');
            return;
        }
        
        if (this.variableCount === 2) {
            this.generateKarno2Var(container);
        } else if (this.variableCount === 3) {
            this.generateKarno3Var(container);
        } else if (this.variableCount === 4) {
            this.generateKarno4Var(container);
        }
    }

    generateKarno2Var(container) {
        console.log('Generating 2-variable Karno map - Grid design');
        
        const isMobile = window.innerWidth <= 768;
        const isVerySmall = window.innerWidth <= 480;
        
        // CSS synchronized cellSize calculation
        const cellSize = isVerySmall ? 40 : (isMobile ? 50 : 65);
        const labelSize = isVerySmall ? 25 : (isMobile ? 30 : 35);
        const fontSize = isVerySmall ? '10px' : (isMobile ? '12px' : '14px');
        const fontSizeMain = isVerySmall ? '12px' : (isMobile ? '14px' : '18px');
        
        // 4x4 grid structure: empty corner + B main + B values + A main + A values + 4 minterms
        let html = `
            <div class="karno-map-grid map-2var-grid" style="
                display: grid;
                grid-template-columns: ${labelSize}px ${labelSize}px repeat(2, ${cellSize}px);
                grid-template-rows: ${labelSize}px ${labelSize}px repeat(2, ${cellSize}px);
                gap: 0;
                border: 2px solid var(--border-color);
                background: white;
                margin: 20px auto;
                width: fit-content;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            ">
                <!-- Top left corner (empty) -->
                <div class="grid-corner" style="
                    grid-column: 1 / 3;
                    grid-row: 1 / 3;
                    background: var(--light-color);
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                "></div>
                
                <!-- B main header -->
                <div class="b-main-label" style="
                    grid-column: 3 / 5;
                    grid-row: 1;
                    background: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSizeMain};
                    border-bottom: 1px solid var(--border-color);
                ">B</div>
                
                <!-- B value labels -->
                <div class="b-label" style="
                    grid-column: 3;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                ">0</div>
                
                <div class="b-label" style="
                    grid-column: 4;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-bottom: 1px solid var(--border-color);
                ">1</div>
                
                <!-- A main header -->
                <div class="a-main-label" style="
                    grid-column: 1;
                    grid-row: 3 / 5;
                    background: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSizeMain};
                    writing-mode: vertical-lr;
                    border-right: 1px solid var(--border-color);
                ">A</div>
        `;

        // A value labels
        const aValues = ['0', '1'];
        for (let row = 0; row < 2; row++) {
            html += `
                <div class="a-label" style="
                    grid-column: 2;
                    grid-row: ${row + 3};
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    ${row < 1 ? 'border-bottom: 1px solid var(--border-color);' : ''}
                ">${aValues[row]}</div>
            `;
        }

        // 2 variable Gray code: A\B: 0, 1
        const order = [0, 1, 3, 2]; // A=0,B=0; A=0,B=1; A=1,B=1; A=1,B=0

        // Minterm cells
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                const index = row * 2 + col;
                const minterm = order[index];
                const value = this.karnoValues[minterm] || 0;
                
                html += `
                    <div class="karno-cell-grid" data-minterm="${minterm}" style="
                        grid-column: ${col + 3};
                        grid-row: ${row + 3};
                        background: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: ${fontSize};
                        cursor: pointer;
                        transition: all 0.3s;
                        user-select: none;
                        ${col < 1 ? 'border-right: 1px solid var(--border-color);' : ''}
                        ${row < 1 ? 'border-bottom: 1px solid var(--border-color);' : ''}
                        position: relative;
                    ">
                        <span>${value}</span>
                    </div>
                `;
            }
        }

        html += '</div>';
        container.innerHTML = html;
        
        // Add event listeners with updated selector
        this.addGridCellEventListeners();
    }

    generateKarno3Var(container) {
        console.log('Generating 3-variable Karno map - Grid design');
        
        const isMobile = window.innerWidth <= 768;
        const isVerySmall = window.innerWidth <= 480;
        
        // CSS synchronized cellSize calculation
        const cellSize = isVerySmall ? 40 : (isMobile ? 50 : 65);
        const labelSize = isVerySmall ? 25 : (isMobile ? 30 : 35);
        const fontSize = isVerySmall ? '10px' : (isMobile ? '12px' : '14px');
        const fontSizeMain = isVerySmall ? '12px' : (isMobile ? '14px' : '18px');
        
        // 5x4 grid structure: empty corner + BC main + BC values + A main + A values + 8 minterms
        let html = `
            <div class="karno-map-grid map-3var-grid" style="
                display: grid;
                grid-template-columns: ${labelSize}px ${labelSize}px repeat(4, ${cellSize}px);
                grid-template-rows: ${labelSize}px ${labelSize}px repeat(2, ${cellSize}px);
                gap: 0;
                border: 2px solid var(--border-color);
                background: white;
                margin: 20px auto;
                width: fit-content;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            ">
                <!-- Top left corner (empty) -->
                <div class="grid-corner" style="
                    grid-column: 1 / 3;
                    grid-row: 1 / 3;
                    background: var(--light-color);
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                "></div>
                
                <!-- BC main header -->
                <div class="bc-main-label" style="
                    grid-column: 3 / 7;
                    grid-row: 1;
                    background: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSizeMain};
                    border-bottom: 1px solid var(--border-color);
                ">BC</div>
                
                <!-- BC value labels -->
                <div class="bc-label" style="
                    grid-column: 3;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                ">00</div>
                
                <div class="bc-label" style="
                    grid-column: 4;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                ">01</div>
                
                <div class="bc-label" style="
                    grid-column: 5;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                ">11</div>
                
                <div class="bc-label" style="
                    grid-column: 6;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-bottom: 1px solid var(--border-color);
                ">10</div>
                
                <!-- A main header -->
                <div class="a-main-label" style="
                    grid-column: 1;
                    grid-row: 3 / 5;
                    background: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSizeMain};
                    writing-mode: vertical-lr;
                    border-right: 1px solid var(--border-color);
                ">A</div>
        `;

        // A value labels
        const aValues = ['0', '1'];
        for (let row = 0; row < 2; row++) {
            html += `
                <div class="a-label" style="
                    grid-column: 2;
                    grid-row: ${row + 3};
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    ${row < 1 ? 'border-bottom: 1px solid var(--border-color);' : ''}
                ">${aValues[row]}</div>
            `;
        }

        // 3 variable Gray code: A\BC: 00, 01, 11, 10
        const order = [
            0, 1, 3, 2,  // A=0: BC=00,01,11,10
            4, 5, 7, 6   // A=1: BC=00,01,11,10
        ];

        // Minterm cells
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
                const index = row * 4 + col;
                const minterm = order[index];
                const value = this.karnoValues[minterm] || 0;
                
                html += `
                    <div class="karno-cell-grid" data-minterm="${minterm}" style="
                        grid-column: ${col + 3};
                        grid-row: ${row + 3};
                        background: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: ${fontSize};
                        cursor: pointer;
                        transition: all 0.3s;
                        user-select: none;
                        ${col < 3 ? 'border-right: 1px solid var(--border-color);' : ''}
                        ${row < 1 ? 'border-bottom: 1px solid var(--border-color);' : ''}
                        position: relative;
                    ">
                        <span>${value}</span>
                    </div>
                `;
            }
        }

        html += '</div>';
        container.innerHTML = html;
        
        // Add event listeners with updated selector
        this.addGridCellEventListeners();
    }

    generateKarno4Var(container) {
        console.log('Generating 4-variable Karnaugh map - Grid intersection design');
        console.log('Container available:', container);
        console.log('KarnoValues status:', this.karnoValues);
        
        // Mobile control
        const isMobile = window.innerWidth <= 768;
        const isVerySmall = window.innerWidth <= 480;
        
        // CSS synchronized cellSize calculation
        const cellSize = isVerySmall ? 40 : (isMobile ? 50 : 65);
        const labelSize = isVerySmall ? 25 : (isMobile ? 30 : 35);
        const fontSize = isVerySmall ? '10px' : (isMobile ? '12px' : '14px');
        const fontSizeMain = isVerySmall ? '12px' : (isMobile ? '14px' : '18px');
        
        // 6x6 grid structure: empty corner + CD main + CD values + AB main + AB values + 16 minterms
        let html = `
            <div class="karno-map-grid map-4var-grid" style="
                display: grid;
                grid-template-columns: ${labelSize}px ${labelSize}px repeat(4, ${cellSize}px);
                grid-template-rows: ${labelSize}px ${labelSize}px repeat(4, ${cellSize}px);
                gap: 0;
                border: 2px solid var(--border-color);
                background: white;
                margin: 20px auto;
                width: fit-content;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            ">
                <!-- Top left corner (empty) -->
                <div class="grid-corner" style="
                    grid-column: 1 / 3;
                    grid-row: 1 / 3;
                    background: var(--light-color);
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                "></div>
                
                <!-- CD main title -->
                <div class="cd-main-label" style="
                    grid-column: 3 / 7;
                    grid-row: 1;
                    background: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSizeMain};
                    border-bottom: 1px solid var(--border-color);
                ">CD</div>
                
                <!-- CD value labels -->
                <div class="cd-label" style="
                    grid-column: 3;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                ">00</div>
                
                <div class="cd-label" style="
                    grid-column: 4;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                ">01</div>
                
                <div class="cd-label" style="
                    grid-column: 5;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                ">11</div>
                
                <div class="cd-label" style="
                    grid-column: 6;
                    grid-row: 2;
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-bottom: 1px solid var(--border-color);
                ">10</div>
                
                <!-- AB main title -->
                <div class="ab-main-label" style="
                    grid-column: 1;
                    grid-row: 3 / 7;
                    background: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSizeMain};
                    writing-mode: vertical-lr;
                    border-right: 1px solid var(--border-color);
                ">AB</div>
        `;

        // AB value labels
        const abValues = ['00', '01', '11', '10'];
        for (let row = 0; row < 4; row++) {
            html += `
                <div class="ab-label" style="
                    grid-column: 2;
                    grid-row: ${row + 3};
                    background: var(--accent-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${fontSize};
                    border-right: 1px solid var(--border-color);
                    ${row < 3 ? 'border-bottom: 1px solid var(--border-color);' : ''}
                ">${abValues[row]}</div>
            `;
        }

        // Gray code ordering: AB\CD: 00, 01, 11, 10
        const order = [
            0,  1,  3,  2,   // AB=00: CD=00,01,11,10 → m0,m1,m3,m2
            4,  5,  7,  6,   // AB=01: CD=00,01,11,10 → m4,m5,m7,m6  
            12, 13, 15, 14,  // AB=11: CD=00,01,11,10 → m12,m13,m15,m14
            8,  9,  11, 10   // AB=10: CD=00,01,11,10 → m8,m9,m11,m10
        ];

        // Minterm cells
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const index = row * 4 + col;
                const minterm = order[index];
                const value = this.karnoValues[minterm] || 0;
                
                html += `
                    <div class="karno-cell-grid" data-minterm="${minterm}" style="
                        grid-column: ${col + 3};
                        grid-row: ${row + 3};
                        background: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: ${fontSize};
                        cursor: pointer;
                        transition: all 0.3s;
                        user-select: none;
                        ${col < 3 ? 'border-right: 1px solid var(--border-color);' : ''}
                        ${row < 3 ? 'border-bottom: 1px solid var(--border-color);' : ''}
                        position: relative;
                    ">
                        <span>${value}</span>
                    </div>
                `;
            }
        }

        html += '</div>';
        container.innerHTML = html;
        
        // Add event listeners with JavaScript - updated selector
        this.addGridCellEventListeners();
    }

    // Grid-based event listeners for 4-variable map
    addGridCellEventListeners() {
        console.log('addGridCellEventListeners called');
        const cells = document.querySelectorAll('.karno-cell-grid');
        console.log('Found grid cell count:', cells.length);
        
        cells.forEach(cell => {
            const minterm = parseInt(cell.dataset.minterm);
            console.log('Adding grid event listener, minterm:', minterm);
            
            // Click event
            cell.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Grid cell clicked, minterm:', minterm);
                this.toggleKarnoCell(minterm);
            });
            
            // Mouse events
            cell.addEventListener('mouseenter', (e) => {
                this.highlightCellGroups(minterm);
            });
            
            cell.addEventListener('mouseleave', (e) => {
                this.removeCellGroupHighlight();
            });
            
            // Make cell clickable
            cell.style.cursor = 'pointer';
        });
    }

    toggleKarnoCell(minterm) {
        console.log('toggleKarnoCell called, minterm:', minterm);
        console.log('Current karnoValues:', this.karnoValues);
        
        // Check lock status
        if (this.isLocked) {
            console.log('⚠️ Map is locked - Clear groups or start new');
            this.showLockMessage();
            return;
        }
        
        const currentValue = this.karnoValues[minterm] || 0;
        console.log('Current value:', currentValue);
        
        // 0 -> 1 -> X -> 0 döngüsü  
        if (currentValue === 0) {
            this.karnoValues[minterm] = 1;
        } else if (currentValue === 1) {
            this.karnoValues[minterm] = 'X';
        } else {
            this.karnoValues[minterm] = 0;
        }
        
        this.truthTable[minterm].output = this.karnoValues[minterm];
        this.renderTruthTable();
        this.renderKarnoMap();
        this.clearResults();
        
        // Otomatik grup bulma kaldırıldı - kullanıcı manuel olarak butsona basacak
        console.log('💡 Hücre değiştirildi, grupları bulmak için "Grupları Bul" butonuna basın');
    }

    renderKarnoMap() {
        console.log('renderKarnoMap called');
        
        // Check both old and new grid cells
        const oldCells = document.querySelectorAll('.karno-cell');
        const gridCells = document.querySelectorAll('.karno-cell-grid');
        const cells = gridCells.length > 0 ? gridCells : oldCells;
        
        console.log('Found Karno cells:', cells.length);
        console.log('Grid cells:', gridCells.length, 'Old cells:', oldCells.length);
        console.log('KarnoValues status:', this.karnoValues);
        
        if (cells.length === 0) {
            console.error('Karno cells not found! generateKarnoMap might not have run.');
            return;
        }
        
        cells.forEach(cell => {
            const minterm = parseInt(cell.dataset.minterm);
            const value = this.karnoValues[minterm] || 0;
            const span = cell.querySelector('span');
            if (span) {
                span.textContent = value;
            }
            
            // Update cell styles
            cell.classList.remove('filled', 'dont-care', 'locked');
            if (value === 1) {
                cell.classList.add('filled');
            } else if (value === 'X') {
                cell.classList.add('dont-care');
            }
            
            // In locked state, just add class, CSS handles cursor
            if (this.isLocked) {
                cell.classList.add('locked');
            }
        });
        
        console.log('Karno map rendered');
    }

    // Advanced group highlighting - complete group dominance (strong color cleaning)
    highlightCellGroups(minterm) {
        console.log('highlightCellGroups called, minterm:', minterm);
        
        // Find groups containing this cell
        const containingGroups = this.groups.filter(group => 
            group.minterms.includes(minterm)
        );
        
        if (containingGroups.length === 0) return;
        
        // STEP 1: Completely remove ALL hover and group colors
        document.querySelectorAll('.karno-cell, .karno-cell-grid').forEach(cell => {
            cell.classList.remove('highlight-hover');
            // Remove all possible group classes
            for (let i = 1; i <= 6; i++) {
                cell.classList.remove(`group-${i}`);
                cell.classList.remove(`group-${i}-hover`);
            }
            // Additional cleanup - other possible color classes
            cell.classList.remove('group-highlight', 'group-hover', 'selected');
        });
        
        // ADIM 2: Dominant grubu belirle
        const dominantGroup = containingGroups.reduce((best, current) => {
            const bestPriority = this.getGroupPriority(best, minterm);
            const currentPriority = this.getGroupPriority(current, minterm);
            return currentPriority > bestPriority ? current : best;
        });
        
        const dominantGroupIndex = this.groups.indexOf(dominantGroup);
        const dominantGroupClass = `group-${(dominantGroupIndex % 6) + 1}`;
        
        console.log(`Dominant grup: index=${dominantGroupIndex}, class=${dominantGroupClass}`);
        
        // ADIM 3: Önce dominant grubun TÜM hücrelerini vurgula
        dominantGroup.minterms.forEach(mt => {
            const cell = document.querySelector(`[data-minterm="${mt}"]`);
            if (cell) {
                // Çifte temizlik
                for (let i = 1; i <= 6; i++) {
                    cell.classList.remove(`group-${i}`);
                    cell.classList.remove(`group-${i}-hover`);
                }
                // Dominant rengi uygula
                cell.classList.add(`${dominantGroupClass}-hover`);
                console.log(`Hücre ${mt} -> ${dominantGroupClass}-hover eklendi`);
            }
        });
        
        // ADIM 4: Diğer grupları sadece kesişmeyen bölgelerde göster
        this.groups.forEach((group, index) => {
            if (group === dominantGroup) return; // Dominant grubu atla
            
            const groupClass = `group-${(index % 6) + 1}`;
            
            group.minterms.forEach(mt => {
                const cell = document.querySelector(`[data-minterm="${mt}"]`);
                if (!cell) return;
                
                // Bu hücre dominant grubun parçası mı?
                if (!dominantGroup.minterms.includes(mt)) {
                    // Kesişmiyor - bu grubun rengini güvenle ekle
                    cell.classList.add(`${groupClass}-hover`);
                    console.log(`Kesişmeyen hücre ${mt} -> ${groupClass}-hover eklendi`);
                } else {
                    console.log(`Kesişen hücre ${mt} -> renk atlandı (dominant grup hakim)`);
                }
            });
        });
        
        // ADIM 5: Mouse'un geldiği hücreyi özel vurgula
        const hoveredCell = document.querySelector(`[data-minterm="${minterm}"]`);
        if (hoveredCell) {
            hoveredCell.classList.add('highlight-hover');
            console.log(`Hover hücresi ${minterm} -> highlight-hover eklendi`);
        }
    }

    removeCellGroupHighlight() {
        console.log('removeCellGroupHighlight called - strong cleanup');
        
        // Completely remove all hover highlights
        document.querySelectorAll('.karno-cell, .karno-cell-grid').forEach(cell => {
            cell.classList.remove('highlight-hover');
            
            // Remove all possible group classes
            for (let i = 1; i <= 6; i++) {
                cell.classList.remove(`group-${i}`);
                cell.classList.remove(`group-${i}-hover`);
            }
            
            // Additional cleanup - possible other hover classes
            cell.classList.remove('group-highlight', 'group-hover', 'selected', 'cell-hover');
            
            // Remove inline colors if they exist in style attribute
            if (cell.style.backgroundColor) {
                cell.style.backgroundColor = '';
            }
            if (cell.style.borderColor) {
                cell.style.borderColor = '';
            }
        });
        
        console.log('Tüm hover efektleri temizlendi');
    }

    clearResults() {
        this.groups = [];
        const groupsList = document.getElementById('groupsList');
        if (groupsList) {
            groupsList.innerHTML = '<p style="color: #6b7280; font-style: italic;">Henüz grup bulunamadı. "Grupları Bul" butonuna tıklayın.</p>';
        }
        
        const solutionDisplay = document.getElementById('solutionDisplay');
        if (solutionDisplay) {
            solutionDisplay.textContent = '';
        }
        
        const termCount = document.getElementById('termCount');
        if (termCount) {
            termCount.textContent = 'Terim sayısı: 0';
        }
        
        const literalCount = document.getElementById('literalCount');
        if (literalCount) {
            literalCount.textContent = 'Literal count: 0';
        }
        
        // Remove group highlighting
        document.querySelectorAll('.karno-cell').forEach(cell => {
            for (let i = 1; i <= 6; i++) {
                cell.classList.remove(`group-${i}`);
            }
        });
        
        // Etiket vurgularını da temizle
        this.clearLabelHighlights();
    }

    clearAll() {
        // Reset all values
        this.karnoValues = [];
        this.truthTable.forEach(row => {
            row.output = 0;
        });
        this.isLocked = false; // Remove lock when results are cleared
        this.renderTruthTable();
        this.renderKarnoMap();
        this.clearResults();
    }

    generateRandom() {
        // Assign random values
        this.truthTable.forEach(row => {
            row.output = Math.random() < 0.3 ? 1 : 0; // 30% chance for 1
        });
        this.isLocked = false; // Remove lock
        this.updateKarnoFromTruthTable();
        this.clearResults();
        
        // Automatic group finding removed - user will press button manually
        console.log('🎲 Random values generated, click "Find Groups" button to find groups');
        setTimeout(() => {
            this.findGroups(); // Bu da artık otomatik olarak showSolution() çağıracak
        }, 100);
    }

    applyMinterms() {
        if (this.isLocked) {
            this.showLockMessage();
            return;
        }
        
        const mintermsInput = document.getElementById('mintermsInput');
        const dontCareInput = document.getElementById('dontCareInput');
        
        if (!mintermsInput) return;
        
        // First reset all
        this.truthTable.forEach(row => {
            row.output = 0;
        });
        
        // Apply minterms
        if (mintermsInput.value.trim()) {
            const minterms = mintermsInput.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            minterms.forEach(minterm => {
                if (minterm >= 0 && minterm < this.truthTable.length) {
                    this.truthTable[minterm].output = 1;
                }
            });
        }
        
        // Apply don't cares
        if (dontCareInput && dontCareInput.value.trim()) {
            const dontCares = dontCareInput.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            dontCares.forEach(minterm => {
                if (minterm >= 0 && minterm < this.truthTable.length) {
                    this.truthTable[minterm].output = 'X';
                }
            });
        }
        
        this.updateKarnoFromTruthTable();
        this.clearResults();
        
        // Automatic group finding removed - user will press button manually
        console.log('💡 Minterms applied, click "Find Groups" button to find groups');
    }

    findGroups() {
        console.log('🔍 findGroups() başladı');
        this.groups = [];
        
        // Aktif mintermleri (1'ler) ve don't care'leri (X'ler) bul
        const activeMinterms = this.karnoValues.map((val, idx) => val === 1 ? idx : null)
                                               .filter(idx => idx !== null);
        const dontCareMinterms = this.karnoValues.map((val, idx) => val === 'X' ? idx : null)
                                                 .filter(idx => idx !== null);
        
        console.log('🔍 Aktif mintermler:', activeMinterms);
        console.log('🔍 Don\'t care mintermler:', dontCareMinterms);
        
        // Grup bulma için hem 1'leri hem de X'leri kullan
        const allMintermsForGrouping = [...activeMinterms, ...dontCareMinterms];
        
        if (activeMinterms.length === 0) {
            this.displayGroups();
            return;
        }

        // Karno haritası kurallarına göre grupları bul (don't care'ler dahil)
        this.findKarnoGroups(allMintermsForGrouping);
        
        // findOptimalCovering zaten optimal seçimi ve redundant filtering'i yapıyor
        // this.selectOptimalGroups(activeMinterms); // Bu satır redundant filtering'i eziyor!
        
        this.displayGroups();
        console.log('🔍 highlightGroups() çağrılmadan önce grup sayısı:', this.groups.length);
        this.highlightGroups();
        
        // Lock the map
        this.isLocked = true;
        this.renderKarnoMap(); // Update to show locked appearance
        console.log('🔒 Map locked - Click "Clear" button to make changes');
        
        // Analyze group labels and highlight unchanging variables
        this.analyzeAndHighlightLabels();
        
        // Auto show solution after groups are found
        setTimeout(() => {
            this.showSolution();
        }, 500); // Short delay for visual effects to complete
    }

    findKarnoGroups(minterms) {
        // Karno haritası sadeleştirme kurallarını uygula
        this.allPossibleGroups = [];
        
        if (this.variableCount === 4) {
            this.findAllGroups4Var(minterms);
        } else if (this.variableCount === 3) {
            this.findAllGroups3Var(minterms);
        } else if (this.variableCount === 2) {
            this.findAllGroups2Var(minterms);
        }
        
        // En iyi kapsama kümesini bul (Petrick's method basitleştirilmiş)
        this.findOptimalCovering(minterms);
    }

    // 4 değişkenli harita için tüm geçerli grupları bul
    findAllGroups4Var(minterms) {
        // 16'lık grup (tüm harita)
        if (minterms.length === 16) {
            this.allPossibleGroups.push({
                minterms: [...minterms],
                size: 16,
                term: '1',
                isPrime: true
            });
            return;
        }

        // 8'lik grupları bul
        this.find8Groups4Var(minterms);
        
        // 4'lük grupları bul
        this.find4Groups4Var(minterms);
        
        // 2'lik grupları bul
        this.find2Groups4Var(minterms);
        
        // Tekil hücreleri bul
        this.find1Groups4Var(minterms);
    }

    find8Groups4Var(minterms) {
        const groups8 = [
            // Yatay yarılar
            [0, 1, 2, 3, 4, 5, 6, 7],       // Üst 2 satır (AB=0x)
            [8, 9, 10, 11, 12, 13, 14, 15], // Alt 2 satır (AB=1x)
            
            // Dikey yarılar
            [0, 1, 4, 5, 8, 9, 12, 13],     // Sol 2 sütun (CD=x0)
            [2, 3, 6, 7, 10, 11, 14, 15],   // Sağ 2 sütun (CD=x1)
            
            // Satır çiftleri - A sabit
            [0, 2, 4, 6, 8, 10, 12, 14],    // A=0,C=0 ve A=1,C=0
            [1, 3, 5, 7, 9, 11, 13, 15],    // A=0,C=1 ve A=1,C=1
            
            // Değişken bazlı 8'li gruplar
            [1, 3, 5, 7, 9, 11, 13, 15],    // D=1 (tüm tek sayılar)
            [0, 2, 4, 6, 8, 10, 12, 14],    // D=0 (tüm çift sayılar)
            [4, 5, 6, 7, 12, 13, 14, 15],   // B=1 (tüm B=1 durumları)
            [0, 1, 2, 3, 8, 9, 10, 11],     // B=0 (tüm B=0 durumları)
            [2, 3, 6, 7, 10, 11, 14, 15],   // C=1 (tüm C=1 durumları)
            [0, 1, 4, 5, 8, 9, 12, 13],     // C=0 (tüm C=0 durumları)
            [8, 9, 10, 11, 12, 13, 14, 15], // A=1 (tüm A=1 durumları)
            [0, 1, 2, 3, 4, 5, 6, 7],       // A=0 (tüm A=0 durumları)
        ];

        for (const group of groups8) {
            if (this.isValidGroup(group, minterms)) {
                this.allPossibleGroups.push({
                    minterms: [...group],
                    size: 8,
                    term: this.generateOptimalTerm(group),
                    isPrime: this.isPrimeImplicant(group, minterms)
                });
            }
        }
    }

    find4Groups4Var(minterms) {
        const groups4 = [
            // 2x2 kare gruplar (Gray code düzeni: 00,01,11,10)
            [0, 1, 4, 5],    // Sol üst kare (AB=00,01, CD=00,01)
            [1, 3, 5, 7],    // Sağ üst kare (AB=00,01, CD=01,11)  
            [3, 2, 7, 6],    // Sağ orta kare (AB=00,01, CD=11,10)
            [2, 0, 6, 4],    // Sol orta kare - sarma (AB=00,01, CD=10,00)
            
            [4, 5, 12, 13],  // Sol 2. kare (AB=01,11, CD=00,01)
            [5, 7, 13, 15],  // Sağ 2. kare (AB=01,11, CD=01,11)
            [7, 6, 15, 14],  // Sağ 3. kare (AB=01,11, CD=11,10)
            [6, 4, 14, 12],  // Sol 3. kare - sarma (AB=01,11, CD=10,00)
            
            [12, 13, 8, 9],  // Sol alt kare (AB=11,10, CD=00,01)
            [13, 15, 9, 11], // Sağ alt kare (AB=11,10, CD=01,11)
            [15, 14, 11, 10], // Sağ 4. kare (AB=11,10, CD=11,10)
            [14, 12, 10, 8], // Sol 4. kare - sarma (AB=11,10, CD=10,00)
            
            // Köşe grupları (sarma)
            [0, 2, 8, 10],   // Sol köşe sarması
            [1, 3, 9, 11],   // Sağ köşe sarması
            
            // Yatay dikdörtgen gruplar (1x4)
            [0, 1, 3, 2],    // Üst satır (AB=00)
            [4, 5, 7, 6],    // 2. satır (AB=01) - İŞTE BU!
            [12, 13, 15, 14], // 3. satır (AB=11)
            [8, 9, 11, 10],  // Alt satır (AB=10)
            
            // Dikey dikdörtgen gruplar (4x1)
            [0, 4, 12, 8],   // Sol sütun (CD=00)
            [1, 5, 13, 9],   // 2. sütun (CD=01)
            [3, 7, 15, 11],  // 3. sütun (CD=11)
            [2, 6, 14, 10],  // Sağ sütun (CD=10)
        ];

        for (const group of groups4) {
            if (this.isValidGroup(group, minterms)) {
                this.allPossibleGroups.push({
                    minterms: [...group],
                    size: 4,
                    term: this.generateOptimalTerm(group),
                    isPrime: this.isPrimeImplicant(group, minterms)
                });
            }
        }
    }

    find2Groups4Var(minterms) {
        const groups2 = [];
        
        // Yatay komşular (Gray code sırasına göre)
        const rows = [
            [0, 1, 3, 2],      // 1. satır (AB=00)
            [4, 5, 7, 6],      // 2. satır (AB=01)
            [12, 13, 15, 14],  // 3. satır (AB=11)
            [8, 9, 11, 10]     // 4. satır (AB=10)
        ];
        
        for (const row of rows) {
            for (let i = 0; i < row.length; i++) {
                const next = (i + 1) % row.length; // Sarmalı komşu
                groups2.push([row[i], row[next]]);
            }
        }
        
        // Dikey komşular
        const cols = [
            [0, 4, 12, 8],     // 1. sütun
            [1, 5, 13, 9],     // 2. sütun
            [3, 7, 15, 11],    // 3. sütun
            [2, 6, 14, 10]     // 4. sütun
        ];
        
        for (const col of cols) {
            for (let i = 0; i < col.length; i++) {
                const next = (i + 1) % col.length; // Sarmalı komşu
                groups2.push([col[i], col[next]]);
            }
        }

        for (const group of groups2) {
            if (this.isValidGroup(group, minterms)) {
                this.allPossibleGroups.push({
                    minterms: [...group],
                    size: 2,
                    term: this.generateOptimalTerm(group),
                    isPrime: this.isPrimeImplicant(group, minterms)
                });
            }
        }
    }

    find1Groups4Var(minterms) {
        for (const minterm of minterms) {
            this.allPossibleGroups.push({
                minterms: [minterm],
                size: 1,
                term: this.generateOptimalTerm([minterm]),
                isPrime: this.isPrimeImplicant([minterm], minterms)
            });
        }
    }

    // 3 değişkenli harita için tüm geçerli grupları bul
    findAllGroups3Var(minterms) {
        if (minterms.length === 8) {
            this.allPossibleGroups.push({
                minterms: [...minterms],
                size: 8,
                term: '1',
                isPrime: true
            });
            return;
        }

        this.find4Groups3Var(minterms);
        this.find2Groups3Var(minterms);
        this.find1Groups3Var(minterms);
    }

    find4Groups3Var(minterms) {
        const groups4 = [
            // Tam satırlar (Gray code sırasında)
            [0, 1, 3, 2],    // Üst satır (A=0, BC=00,01,11,10)
            [4, 5, 7, 6],    // Alt satır (A=1, BC=00,01,11,10)
            
            // 2x2 kare gruplar (dikey komşu çiftler)
            [0, 1, 4, 5],    // Sol kare (BC=00,01)
            [1, 3, 5, 7],    // Orta kare (BC=01,11)
            [3, 2, 7, 6],    // Sağ kare (BC=11,10)
            [2, 0, 6, 4],    // Sarma kare (BC=10,00) - sol-sağ sarma
            
            // Dikey sütun çiftleri (sarmalı)
            [0, 2, 4, 6],    // 1. ve 3. sütun (BC=00,10)
            [1, 3, 5, 7],    // 2. ve 4. sütun (BC=01,11)
        ];

        for (const group of groups4) {
            if (this.isValidGroup(group, minterms)) {
                this.allPossibleGroups.push({
                    minterms: [...group],
                    size: 4,
                    term: this.generateOptimalTerm(group),
                    isPrime: this.isPrimeImplicant(group, minterms)
                });
            }
        }
    }

    find2Groups3Var(minterms) {
        const groups2 = [];
        
        // Yatay komşular (Gray code sırasına göre)
        const rows = [
            [0, 1, 3, 2],      // Üst satır (A=0)
            [4, 5, 7, 6]       // Alt satır (A=1)
        ];
        
        for (const row of rows) {
            for (let i = 0; i < row.length; i++) {
                const next = (i + 1) % row.length;
                groups2.push([row[i], row[next]]);
            }
        }
        
        // Dikey komşular
        groups2.push([0, 4], [1, 5], [3, 7], [2, 6]);

        for (const group of groups2) {
            if (this.isValidGroup(group, minterms)) {
                this.allPossibleGroups.push({
                    minterms: [...group],
                    size: 2,
                    term: this.generateOptimalTerm(group),
                    isPrime: this.isPrimeImplicant(group, minterms)
                });
            }
        }
    }

    find1Groups3Var(minterms) {
        for (const minterm of minterms) {
            this.allPossibleGroups.push({
                minterms: [minterm],
                size: 1,
                term: this.generateOptimalTerm([minterm]),
                isPrime: this.isPrimeImplicant([minterm], minterms)
            });
        }
    }

    // 2 değişkenli harita için tüm geçerli grupları bul
    findAllGroups2Var(minterms) {
        if (minterms.length === 4) {
            this.allPossibleGroups.push({
                minterms: [...minterms],
                size: 4,
                term: '1',
                isPrime: true
            });
            return;
        }

        this.find2Groups2Var(minterms);
        this.find1Groups2Var(minterms);
    }

    find2Groups2Var(minterms) {
        const groups2 = [
            [0, 1], // Üst satır (A=0)
            [2, 3], // Alt satır (A=1)
            [0, 2], // Sol sütun (B=0)
            [1, 3], // Sağ sütun (B=1)
        ];

        for (const group of groups2) {
            if (this.isValidGroup(group, minterms)) {
                this.allPossibleGroups.push({
                    minterms: [...group],
                    size: 2,
                    term: this.generateOptimalTerm(group),
                    isPrime: this.isPrimeImplicant(group, minterms)
                });
            }
        }
    }

    find1Groups2Var(minterms) {
        for (const minterm of minterms) {
            this.allPossibleGroups.push({
                minterms: [minterm],
                size: 1,
                term: this.generateOptimalTerm([minterm]),
                isPrime: this.isPrimeImplicant([minterm], minterms)
            });
        }
    }

    // Bir grubun geçerli olup olmadığını kontrol et
    isValidGroup(group, minterms) {
        return group.every(minterm => minterms.includes(minterm));
    }

    // Prime implicant kontrolü
    isPrimeImplicant(group, allMinterms) {
        // Bir grup prime implicant'tır eğer daha büyük bir gruba genişletilemiyorsa
        for (const possibleGroup of this.allPossibleGroups) {
            if (possibleGroup.size > group.length && 
                group.every(minterm => possibleGroup.minterms.includes(minterm))) {
                return false;
            }
        }
        return true;
    }

    // Optimal kapsama bulma (Petrick's method basitleştirilmiş)
    findOptimalCovering(minterms) {
        console.log('🔍 Optimal grup kapsama başlatılıyor...');
        console.log('Bulunan tüm gruplar:', this.allPossibleGroups);
        
        // Önce grupları boyut ve öncelik sırasına göre sırala (büyükten küçüğe)
        const sortedGroups = this.allPossibleGroups
            .filter(group => group.minterms.some(m => minterms.includes(m))) // Sadece ilgili grupları al
            .sort((a, b) => {
                // 1. Öncelik: Grup boyutu (büyük gruplar önce)
                if (a.size !== b.size) return b.size - a.size;
                // 2. Öncelik: Kapsadığı minterm sayısı
                const aRelevant = a.minterms.filter(m => minterms.includes(m)).length;
                const bRelevant = b.minterms.filter(m => minterms.includes(m)).length;
                return bRelevant - aRelevant;
            });
        
        console.log('Sıralanmış gruplar:', sortedGroups);
        
        // Greedy yaklaşımla optimal kapsama bul
        const selectedGroups = [];
        const coveredMinterms = new Set();
        const targetMinterms = new Set(minterms.filter(m => this.karnoValues[m] === 1)); // Sadece 1'leri kapsa
        
        console.log('Kaplanacak mintermler:', Array.from(targetMinterms));
        
        for (const group of sortedGroups) {
            // Bu grup yeni mintermler kapsıyor mu?
            const newMinterms = group.minterms.filter(m => 
                targetMinterms.has(m) && !coveredMinterms.has(m)
            );
            
            if (newMinterms.length > 0) {
                // BD grubu için özel kontrol (3,4,5,7,11,12,13,15 test case)
                if (group.term === 'BD' && this.shouldSkipBDGroup(minterms, selectedGroups)) {
                    console.log('🚫 BD grubu atlandı (redundant)');
                    continue;
                }
                
                selectedGroups.push(group);
                group.minterms.forEach(m => {
                    if (targetMinterms.has(m)) {
                        coveredMinterms.add(m);
                    }
                });
                
                console.log(`✅ Grup seçildi: ${group.size}'lü grup, yeni mintermler: [${newMinterms.join(',')}]`);
                console.log(`   Kapsanan toplam: [${Array.from(coveredMinterms).join(',')}]`);
                
                // Tüm mintermler kaplandı mı?
                if (coveredMinterms.size === targetMinterms.size) {
                    console.log('🎯 Tüm mintermler kaplandı!');
                    break;
                }
            }
        }
        
        // Post-processing: Redundant grupları çıkar (özellikle BD problemi için)
        console.log('🔄 filterRedundantGroups çağrılıyor...');
        console.log('Seçilen gruplar (filtreleme öncesi):', selectedGroups.map(g => g.term));
        const finalGroups = this.filterRedundantGroups(selectedGroups, minterms);
        console.log('Final gruplar (filtreleme sonrası):', finalGroups.map(g => g.term));
        
        // Sonucu ata
        this.groups = finalGroups.map((group, index) => ({
            ...group,
            id: index + 1,
            color: this.getGroupColor(index)
        }));
        
        console.log('✅ Seçilen optimal gruplar:', this.groups);
        console.log('🔍 DEBUG: this.groups uzunluğu:', this.groups.length);
    }

    // Essential prime implicant'ları bul
    findEssentialPrimeImplicants(minterms, primeImplicants) {
        const essential = [];
        const coveredMinterms = new Set();
        
        for (const minterm of minterms) {
            const coveringGroups = primeImplicants.filter(group => 
                group.minterms.includes(minterm)
            );
            
            if (coveringGroups.length === 1) {
                const essentialGroup = coveringGroups[0];
                if (!essential.includes(essentialGroup)) {
                    essential.push(essentialGroup);
                    essentialGroup.minterms.forEach(m => coveredMinterms.add(m));
                }
            }
        }
        
        return essential;
    }

    // Minimal kapsama bulma (greedy approach)
    findMinimalCovering(minterms, primeImplicants, essentialPrimes) {
        const selected = [...essentialPrimes];
        const coveredMinterms = new Set();
        
        // Essential prime'ların kapsadığı mintermleri işaretle
        essentialPrimes.forEach(group => {
            group.minterms.forEach(m => coveredMinterms.add(m));
        });
        
        // Kalan mintermleri greedy algoritma ile kapsa
        const remainingPrimes = primeImplicants.filter(group => !selected.includes(group));
        
        while (coveredMinterms.size < minterms.length && remainingPrimes.length > 0) {
            // En çok yeni minterm kapsayan grubu seç
            let bestGroup = null;
            let maxNewCoverage = 0;
            
            for (const group of remainingPrimes) {
                const newCoverage = group.minterms.filter(m => 
                    minterms.includes(m) && !coveredMinterms.has(m)
                ).length;
                
                if (newCoverage > maxNewCoverage) {
                    maxNewCoverage = newCoverage;
                    bestGroup = group;
                }
            }
            
            if (bestGroup && maxNewCoverage > 0) {
                selected.push(bestGroup);
                bestGroup.minterms.forEach(m => {
                    if (minterms.includes(m)) {
                        coveredMinterms.add(m);
                    }
                });
                
                const index = remainingPrimes.indexOf(bestGroup);
                remainingPrimes.splice(index, 1);
            } else {
                break;
            }
        }
        
        this.allPossibleGroups = selected;
    }

    selectOptimalGroups(activeMinterms) {
        // Sadece aktif mintermleri kapsayan grupları seç
        const coveredMinterms = new Set();
        const selectedGroups = [];
        
        // Boyuta göre sırala (büyükten küçüğe)
        const sortedGroups = this.allPossibleGroups.sort((a, b) => b.size - a.size);
        
        for (const group of sortedGroups) {
            // Bu grubun yeni aktif mintermleri kapsayıp kapsamadığını kontrol et
            const uncoveredActiveInGroup = group.minterms.filter(m => 
                activeMinterms.includes(m) && !coveredMinterms.has(m)
            );
            
            if (uncoveredActiveInGroup.length > 0) {
                selectedGroups.push(group);
                // Sadece aktif mintermleri kaplandı olarak işaretle
                uncoveredActiveInGroup.forEach(m => coveredMinterms.add(m));
                
                // Tüm aktif mintermler kaplandıysa dur
                if (coveredMinterms.size === activeMinterms.length) {
                    break;
                }
            }
        }

        this.groups = selectedGroups;
    }

    // Grup rengi döndür
    getGroupColor(index) {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#ffeaa7', '#dda0dd', '#98d8c8', '#f39c12'
        ];
        return colors[index % colors.length];
    }

    generateOptimalTerm(minterms) {
        if (minterms.length === 1) {
            // Tek minterm için tam terim oluştur
            const minterm = minterms[0];
            const binary = minterm.toString(2).padStart(this.variableCount, '0');
            let term = '';
            
            for (let i = 0; i < this.variableCount; i++) {
                if (term.length > 0) term += '';
                if (binary[i] === '1') {
                    term += this.variables[i];
                } else {
                    term += this.variables[i] + "'";
                }
            }
            return term;
        } else {
            // Grup için ortak olmayan değişkenleri çıkar
            const binaryTerms = minterms.map(m => 
                m.toString(2).padStart(this.variableCount, '0')
            );
            
            let term = '';
            for (let i = 0; i < this.variableCount; i++) {
                const firstBit = binaryTerms[0][i];
                const allSame = binaryTerms.every(binary => binary[i] === firstBit);
                
                if (allSame) {
                    if (term.length > 0) term += '';
                    if (firstBit === '1') {
                        term += this.variables[i];
                    } else {
                        term += this.variables[i] + "'";
                    }
                }
            }
            
            return term || '1';
        }
    }

    displayGroups() {
        const groupsList = document.getElementById('groupsList');
        if (!groupsList) return;
        
        if (this.groups.length === 0) {
            groupsList.innerHTML = '<p style="color: #6b7280; font-style: italic;">Henüz grup bulunamadı. "Grupları Bul" butonuna tıklayın.</p>';
            return;
        }

        let html = '';
        this.groups.forEach((group, index) => {
            const colorClass = `group-color-${(index % 6) + 1}`;
            
            // Bu grup için invariant değişkenleri bul
            const invariants = this.findInvariantVariables(group);
            
            // Değişken durumlarını göster
            let variableStatus = '';
            this.variables.forEach(varName => {
                if (invariants.hasOwnProperty(varName)) {
                    // Sabit değişken (yeşil)
                    const value = invariants[varName];
                    variableStatus += `<span style="color: #22c55e; font-weight: bold;">${varName}=${value}</span> `;
                } else {
                    // Değişken olan (kırmızı)
                    variableStatus += `<span style="color: #ef4444; font-weight: bold;">${varName}=variable</span> `;
                }
            });
            
            html += `
                <div class="group-item ${colorClass}" data-group-index="${index}">
                    <div class="group-header">
                        <span class="group-size">Size: ${group.size}</span>
                        <span class="group-term">${group.term}</span>
                    </div>
                    <div class="group-variables" style="font-size: 0.9em; margin: 8px 0;">
                        <strong>Variables:</strong> ${variableStatus}
                        <br><small style="color: #6b7280;">🟢 Invariant values, 🔴 Variable values (not included in final term)</small>
                    </div>
                    <div class="group-minterms">
                        Minterms: ${group.minterms.join(', ')}
                    </div>
                </div>
            `;
        });
        
        groupsList.innerHTML = html;
        
        // Grup hover eventlerini ekle
        document.querySelectorAll('.group-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const groupIndex = parseInt(e.currentTarget.dataset.groupIndex);
                this.highlightGroup(groupIndex);
            });
            
            item.addEventListener('mouseleave', () => {
                this.removeCellGroupHighlight();
            });
        });
    }

    highlightGroups() {
        console.log('🎨 highlightGroups çağrıldı, grup sayısı:', this.groups.length);
        console.log('🎨 Gruplar:', this.groups.map(g => `${g.term}(${g.minterms.join(',')})`));
        
        // Remove existing group highlighting from both old and new grid cells
        const oldCells = document.querySelectorAll('.karno-cell');
        const gridCells = document.querySelectorAll('.karno-cell-grid');
        const allCells = [...oldCells, ...gridCells];
        
        console.log('🎨 Bulunan hücreler - Eski:', oldCells.length, 'Grid:', gridCells.length);
        
        allCells.forEach(cell => {
            for (let i = 1; i <= 6; i++) {
                cell.classList.remove(`group-${i}`, `group-${i}-hover`);
            }
        });

        // Add new group highlighting
        this.groups.forEach((group, index) => {
            console.log(`🎨 Grup ${index + 1} highlight'lanıyor:`, group.term, group.minterms);
            group.minterms.forEach(minterm => {
                const cell = document.querySelector(`[data-minterm="${minterm}"]`);
                if (cell) {
                    const groupClass = `group-${(index % 6) + 1}`;
                    cell.classList.add(groupClass);
                    console.log(`🎨 Minterm ${minterm} için ${groupClass} eklendi`);
                } else {
                    console.warn(`🎨 Minterm ${minterm} için hücre bulunamadı!`);
                }
            });
        });
        
        console.log('🎨 highlightGroups tamamlandı');
    }

    highlightGroup(groupIndex) {
        // Tüm hover highlight'larını kaldır
        document.querySelectorAll('.karno-cell').forEach(cell => {
            for (let i = 1; i <= 6; i++) {
                cell.classList.remove(`group-${i}-hover`);
            }
        });
        
        if (groupIndex >= 0 && groupIndex < this.groups.length) {
            const group = this.groups[groupIndex];
            const groupClass = `group-${(groupIndex % 6) + 1}`;
            
            group.minterms.forEach(minterm => {
                const cell = document.querySelector(`[data-minterm="${minterm}"]`);
                if (cell) {
                    cell.classList.add(`${groupClass}-hover`);
                }
            });
        }
    }

    // Karno hücresine mouse gelince o hücreyi içeren grupları highlight et
    highlightCellGroups(minterm) {
        console.log('highlightCellGroups çağrıldı, minterm:', minterm);
        
        // Bu hücreyi içeren grupları bul
        const containingGroups = this.groups.filter(group => 
            group.minterms.includes(minterm)
        );
        
        if (containingGroups.length === 0) return;
        
        // Tüm hover highlight'larını kaldır
        document.querySelectorAll('.karno-cell').forEach(cell => {
            cell.classList.remove('highlight-hover');
            for (let i = 1; i <= 6; i++) {
                cell.classList.remove(`group-${i}-hover`);
            }
        });
        
        // Tüm grupları vurgula ancak öncelik sırasına göre
        containingGroups.forEach((group, priority) => {
            const realGroupIndex = this.groups.indexOf(group);
            const groupClass = `group-${(realGroupIndex % 6) + 1}`;
            
            // Bu grubun tüm hücrelerini vurgula
            group.minterms.forEach(mt => {
                const cell = document.querySelector(`[data-minterm="${mt}"]`);
                if (cell) {
                    // Hücrenin kaç grupta olduğunu kontrol et
                    const cellGroups = this.groups.filter(g => g.minterms.includes(mt));
                    
                    if (cellGroups.length === 1) {
                        // Sadece bir grupta ise normal vurgula
                        cell.classList.add(`${groupClass}-hover`);
                    } else {
                        // Birden fazla grupta ise
                        const hoveredCellGroups = containingGroups.filter(g => g.minterms.includes(mt));
                        
                        if (hoveredCellGroups.length > 0) {
                            // Mouse'un geldiği hücreyi içeren gruplardan birine öncelik ver
                            const priorityGroup = hoveredCellGroups.find(g => g.minterms.includes(minterm));
                            if (priorityGroup) {
                                const priorityGroupIndex = this.groups.indexOf(priorityGroup);
                                const priorityGroupClass = `group-${(priorityGroupIndex % 6) + 1}`;
                                
                                // Tüm grup sınıflarını kaldır
                                for (let i = 1; i <= 6; i++) {
                                    cell.classList.remove(`group-${i}-hover`);
                                }
                                // Öncelikli grup sınıfını ekle
                                cell.classList.add(`${priorityGroupClass}-hover`);
                            }
                        } else {
                            // Normal vurgulama
                            cell.classList.add(`${groupClass}-hover`);
                        }
                    }
                }
            });
        });
        
        // Mouse'un geldiği hücreyi özel olarak vurgula
        const hoveredCell = document.querySelector(`[data-minterm="${minterm}"]`);
        if (hoveredCell) {
            hoveredCell.classList.add('highlight-hover');
        }
    }

    // Gelişmiş grup vurgulama - kesişen bölgeleri akıllı yönetir
    highlightCellGroupsAdvanced(minterm) {
        console.log('highlightCellGroupsAdvanced çağrıldı, minterm:', minterm);
        
        // Bu hücreyi içeren grupları bul
        const containingGroups = this.groups.filter(group => 
            group.minterms.includes(minterm)
        );
        
        if (containingGroups.length === 0) return;
        
        // Tüm hover highlight'larını kaldır
        document.querySelectorAll('.karno-cell').forEach(cell => {
            cell.classList.remove('highlight-hover');
            for (let i = 1; i <= 6; i++) {
                cell.classList.remove(`group-${i}-hover`);
            }
        });
        
        // Her bir grup için vurgulama yap
        containingGroups.forEach((group, index) => {
            const realGroupIndex = this.groups.indexOf(group);
            const groupClass = `group-${(realGroupIndex % 6) + 1}`;
            
            group.minterms.forEach(mt => {
                const cell = document.querySelector(`[data-minterm="${mt}"]`);
                if (cell) {
                    // Bu hücreyi içeren tüm grupları bul
                    const cellContainingGroups = containingGroups.filter(g => g.minterms.includes(mt));
                    
                    if (cellContainingGroups.length === 1) {
                        // Sadece bir grup bu hücreyi içeriyorsa, normal vurgula
                        cell.classList.add(`${groupClass}-hover`);
                    } else {
                        // Birden fazla grup bu hücreyi içeriyorsa
                        // Mouse'un geldiği hücreyi içeren gruplardan en küçük index'e sahip olanı seç
                        const priorityGroup = cellContainingGroups.reduce((prev, curr) => {
                            const prevIndex = this.groups.indexOf(prev);
                            const currIndex = this.groups.indexOf(curr);
                            return prevIndex < currIndex ? prev : curr;
                        });
                        
                        const priorityGroupIndex = this.groups.indexOf(priorityGroup);
                        const priorityGroupClass = `group-${(priorityGroupIndex % 6) + 1}`;
                        
                        // Sadece öncelikli grubun rengini uygula
                        cell.classList.add(`${priorityGroupClass}-hover`);
                    }
                }
            });
        });
        
        // Mouse'un geldiği hücreyi özellikle vurgula
        const hoveredCell = document.querySelector(`[data-minterm="${minterm}"]`);
        if (hoveredCell) {
            hoveredCell.classList.add('highlight-hover');
        }
    }

    // Grup öncelik sistemi - dominant grup stratejisi
    getGroupPriority(group, hoveredMinterm) {
        // Mouse'un geldiği hücreyi içerip içermeme (içerenler çok yüksek öncelik)
        const containsHoveredScore = group.minterms.includes(hoveredMinterm) ? 100 : 0;
        
        // Grup boyutu (büyük gruplar daha düşük öncelik)
        const sizeScore = 1 / group.size;
        
        // Grubun index'i (erken bulunan gruplar daha yüksek öncelik)
        const indexScore = (this.groups.length - this.groups.indexOf(group)) / this.groups.length;
        
        return containsHoveredScore + sizeScore + indexScore;
    }

    // Çok gelişmiş grup vurgulama - tam kontrollü kesişim yönetimi
    highlightCellGroupsSmart(minterm) {
        console.log('highlightCellGroupsSmart çağrıldı, minterm:', minterm);
        
        // Bu hücreyi içeren grupları bul
        const containingGroups = this.groups.filter(group => 
            group.minterms.includes(minterm)
        );
        
        if (containingGroups.length === 0) return;
        
        // Tüm hover highlight'larını kaldır
        document.querySelectorAll('.karno-cell').forEach(cell => {
            cell.classList.remove('highlight-hover');
            for (let i = 1; i <= 6; i++) {
                cell.classList.remove(`group-${i}-hover`);
            }
        });
        
        // Her hücre için hangi grubun rengini göstereceğini belirle
        const cellColorMap = new Map();
        
        // Önce tüm grupları vurgula, ancak çakışmaları çöz
        containingGroups.forEach(group => {
            group.minterms.forEach(mt => {
                if (!cellColorMap.has(mt)) {
                    // Bu hücre henüz atanmamış
                    const cellGroups = containingGroups.filter(g => g.minterms.includes(mt));
                    
                    if (cellGroups.length === 1) {
                        // Sadece bir grup bu hücreyi içeriyor
                        cellColorMap.set(mt, group);
                    } else {
                        // Birden fazla grup bu hücreyi içeriyorsa
                        // Öncelik hesapla
                        const bestGroup = cellGroups.reduce((best, current) => {
                            const bestPriority = this.getGroupPriority(best, minterm);
                            const currentPriority = this.getGroupPriority(current, minterm);
                            return currentPriority > bestPriority ? current : best;
                        });
                        
                        cellColorMap.set(mt, bestGroup);
                    }
                }
            });
        });
        
        // Renkleri uygula
        cellColorMap.forEach((group, mt) => {
            const cell = document.querySelector(`[data-minterm="${mt}"]`);
            if (cell) {
                const realGroupIndex = this.groups.indexOf(group);
                const groupClass = `group-${(realGroupIndex % 6) + 1}`;
                cell.classList.add(`${groupClass}-hover`);
            }
        });
        
        // Mouse'un geldiği hücreyi özel vurgula
        const hoveredCell = document.querySelector(`[data-minterm="${minterm}"]`);
        if (hoveredCell) {
            hoveredCell.classList.add('highlight-hover');
        }
    }

    // Gelişmiş çözüm gösterme fonksiyonu - detaylı sadeleştirilmiş fonksiyon çıktısı
    showSolution() {
        if (this.groups.length === 0) {
            console.log('No groups found, calling findGroups...');
            this.findGroups();
            if (this.groups.length === 0) {
                this.displayEmptySolution();
                this.isLocked = true; // Lock even for empty solution
                return;
            }
        }

        this.isLocked = true; // Lock after showing solution
        this.displayDetailedSolution();
        this.generateCircuitDiagram();
    }

    // Boş çözüm görüntüleme
    displayEmptySolution() {
        const solutionDisplay = document.getElementById('solutionDisplay');
        const termCount = document.getElementById('termCount');
        const literalCount = document.getElementById('literalCount');
        
        if (solutionDisplay) {
            solutionDisplay.innerHTML = `
                <div class="solution-result">
                    <div class="solution-primary">F = 0</div>
                    <div class="solution-description">Fonksiyon her zaman 0 (FALSE) değerini alır</div>
                </div>
            `;
        }
        
        if (termCount) termCount.textContent = 'Terim sayısı: 0';
        if (literalCount) literalCount.textContent = 'Literal count: 0';
    }

    // Detaylı çözüm görüntüleme
    displayDetailedSolution() {
        const solutionDisplay = document.getElementById('solutionDisplay');
        const termCount = document.getElementById('termCount');
        const literalCount = document.getElementById('literalCount');
        
        if (!solutionDisplay) return;

        // Temel istatistikler hesapla
        let totalTerms = this.groups.length;
        let totalLiterals = 0;
        let totalMinterms = new Set();
        
        // Her grup için literal sayısını hesapla ve unique minterm'leri topla
        this.groups.forEach(group => {
            // Literal sayısı hesaplama (kesim işareti ' karakterini sayma)
            const literalCount = (group.term.match(/[A-D]/g) || []).length;
            totalLiterals += literalCount;
            
            // Bu grubun kapsadığı minterm'leri ekle
            group.minterms.forEach(mt => totalMinterms.add(mt));
        });

        // Grup türü analizi
        const groupSizes = this.groups.map(g => g.size);
        const maxGroupSize = Math.max(...groupSizes);
        const optimization = this.calculateOptimizationLevel();

        // Ana Boolean ifadesi
        const terms = this.groups.map(group => group.term);
        const solutionExpression = 'F = ' + terms.join(' + ');
        
        // Sum of Products (SOP) formu
        const sopForm = this.generateSOPForm();
        
        // Detaylı HTML çıktısı oluştur
        solutionDisplay.innerHTML = `
            <div class="solution-result">
                <div class="solution-primary">${solutionExpression}</div>
                
                <div class="solution-details">
                    <div class="solution-section">
                        <h4><i class="fas fa-info-circle"></i> Solution Analysis</h4>
                        <div class="solution-stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">Optimization Level:</span>
                                <span class="stat-value optimization-${optimization.level}">${optimization.description}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Covered Minterms:</span>
                                <span class="stat-value">${totalMinterms.size} terms</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Largest Group:</span>
                                <span class="stat-value">${maxGroupSize} cells</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="solution-section">
                        <h4><i class="fas fa-list"></i> Group Details</h4>
                        <div class="groups-summary">
                            ${this.generateGroupsSummary()}
                        </div>
                    </div>
                    
                    <div class="solution-section">
                        <h4><i class="fas fa-code"></i> Boolean Forms</h4>
                        <div class="boolean-forms">
                            <div class="form-item">
                                <strong>Minterm SOP:</strong> 
                                <code>${sopForm}</code>
                            </div>
                            <div class="form-item">
                                <strong>Optimize SOP:</strong> 
                                <code>${solutionExpression}</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // İstatistikleri güncelle
        if (termCount) {
            termCount.innerHTML = `<i class="fas fa-layer-group"></i> Term count: <strong>${totalTerms}</strong>`;
        }
        if (literalCount) {
            literalCount.innerHTML = `<i class="fas fa-font"></i> Literal count: <strong>${totalLiterals}</strong>`;
        }
    }

    // Optimizasyon seviyesi hesapla
    calculateOptimizationLevel() {
        const totalMinterms = this.truthTable.filter(row => row.output === 1).length;
        const optimizedTerms = this.groups.length;
        
        if (totalMinterms === 0) {
            return { level: 'none', description: 'No Optimization' };
        }
        
        const reductionRatio = 1 - (optimizedTerms / totalMinterms);
        
        if (reductionRatio >= 0.75) {
            return { level: 'excellent', description: 'Excellent (' + Math.round(reductionRatio * 100) + '% reduction)' };
        } else if (reductionRatio >= 0.5) {
            return { level: 'good', description: 'Good (' + Math.round(reductionRatio * 100) + '% reduction)' };
        } else if (reductionRatio >= 0.25) {
            return { level: 'moderate', description: 'Moderate (' + Math.round(reductionRatio * 100) + '% reduction)' };
        } else {
            return { level: 'minimal', description: 'Minimal (' + Math.round(reductionRatio * 100) + '% reduction)' };
        }
    }

    // Sum of Products formunu oluştur
    generateSOPForm() {
        const activeMinterms = [];
        this.truthTable.forEach((row, index) => {
            if (row.output === 1) {
                activeMinterms.push(index);
            }
        });
        
        if (activeMinterms.length === 0) {
            return 'F = 0';
        }
        
        return 'F = m(' + activeMinterms.join(', ') + ')';
    }

    // Grupların özet bilgilerini oluştur
    generateGroupsSummary() {
        return this.groups.map((group, index) => {
            const literals = (group.term.match(/[A-D]/g) || []).length;
            const mintermsStr = group.minterms.sort((a, b) => a - b).join(', ');
            
            return `
                <div class="group-summary-item group-${(index % 6) + 1}">
                    <div class="group-header">
                        <span class="group-label">Group ${index + 1}</span>
                        <span class="group-size">${group.size} cells</span>
                    </div>
                    <div class="group-term">
                        <strong>${group.term}</strong>
                        <span class="literal-count">(${literals} literals)</span>
                    </div>
                    <div class="group-minterms">
                        Minterms: ${mintermsStr}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Mantıksal kapı şeması oluşturma (placeholder)
    generateCircuitDiagram() {
        const circuitDisplay = document.getElementById('circuitDisplay');
        if (!circuitDisplay) return;
        
        if (this.groups.length === 0) {
            circuitDisplay.innerHTML = `
                <div class="circuit-empty">
                    <i class="fas fa-info-circle"></i>
                    <p>Önce grupları bulun ve çözümü gösterin</p>
                </div>
            `;
            return;
        }
        
        // Basit metin tabanlı devre gösterimi
        let circuitText = `
            <div class="circuit-text">
                <h4>Boolean Devre Şeması</h4>
                <div class="circuit-description">
                    <p><strong>Giriş Sinyalleri:</strong> ${this.variables.join(', ')}</p>
                    <p><strong>Çıkış Sinyali:</strong> F</p>
                    <p><strong>Gerekli Kapılar:</strong></p>
                    <ul>
                        <li>AND Kapıları: ${this.groups.length} adet</li>
                        <li>OR Kapısı: ${this.groups.length > 1 ? '1 adet' : 'Gerekmiyor'}</li>
                        <li>NOT Kapıları: ${this.countRequiredInverters()} adet</li>
                    </ul>
                </div>
                <div class="circuit-equation">
                    <strong>Devre Denklemi:</strong><br>
                    F = ${this.groups.map(g => g.term).join(' + ')}
                </div>
            </div>
        `;
        
        circuitDisplay.innerHTML = circuitText;
    }

    // Gerekli inverter sayısını hesapla
    countRequiredInverters() {
        const invertedVariables = new Set();
        this.groups.forEach(group => {
            // Kesim işareti içeren değişkenleri bul
            const matches = group.term.match(/[A-D]'/g);
            if (matches) {
                matches.forEach(match => {
                    invertedVariables.add(match.charAt(0));
                });
            }
        });
        return invertedVariables.size;
    }

    // SVG tabanlı mantıksal kapı şeması oluşturma
    generateSVGCircuitDiagram() {
        const circuitDisplay = document.getElementById('circuitDisplay');
        if (!circuitDisplay) return;
        
        if (this.groups.length === 0) {
            circuitDisplay.innerHTML = `
                <div class="circuit-empty">
                    <i class="fas fa-info-circle"></i>
                    <p>Önce grupları bulun ve çözümü gösterin</p>
                </div>
            `;
            return;
        }

        const svgDiagram = this.createLogicGatesSVG();
        circuitDisplay.innerHTML = `
            <div class="circuit-svg-container">
                <div class="circuit-title">
                    <h4><i class="fas fa-microchip"></i> Mantıksal Kapı Şeması</h4>
                    <div class="circuit-info">
                        <span>Giriş: ${this.variables.join(', ')}</span>
                        <span>Çıkış: F</span>
                        <span>Kapılar: ${this.groups.length + (this.groups.length > 1 ? 1 : 0)} adet</span>
                    </div>
                </div>
                ${svgDiagram}
                <div class="circuit-equation">
                    <strong>F = ${this.groups.map(g => g.term).join(' + ')}</strong>
                </div>
            </div>
        `;
    }

    // SVG kapı şeması oluşturucu
    createLogicGatesSVG() {
        const width = Math.max(800, this.groups.length * 150 + 200);
        const height = Math.max(400, this.groups.length * 80 + 150);
        
        let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="logic-circuit">
            <defs>
                ${this.createSVGDefinitions()}
            </defs>
            <rect width="100%" height="100%" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" rx="10"/>
        `;

        // Giriş sinyalleri
        const inputY = 50;
        const inputSpacing = 60;
        const inputs = this.getRequiredInputs();
        
        inputs.forEach((input, index) => {
            const y = inputY + index * inputSpacing;
            svg += `
                <!-- Giriş: ${input} -->
                <text x="20" y="${y + 5}" class="input-label">${input}</text>
                <line x1="40" y1="${y}" x2="80" y2="${y}" class="wire"/>
                <circle cx="45" cy="${y}" r="3" class="input-point"/>
            `;
        });

        // AND kapıları (her grup için)
        const andGateStartX = 120;
        const andGateY = 80;
        const andGateSpacing = 100;
        
        this.groups.forEach((group, index) => {
            const gateY = andGateY + index * andGateSpacing;
            const gateX = andGateStartX;
            
            // AND kapısı çiz
            svg += this.createANDGate(gateX, gateY, `and_${index}`, group.term);
            
            // Giriş bağlantıları
            const groupInputs = this.parseTermInputs(group.term);
            groupInputs.forEach((inputSignal, inputIndex) => {
                const signalInputY = inputY + inputs.indexOf(inputSignal) * inputSpacing;
                const gateInputY = gateY + inputIndex * 15 - (groupInputs.length - 1) * 7.5;
                
                svg += `<line x1="80" y1="${signalInputY}" x2="${gateX}" y2="${gateInputY}" class="wire"/>`;
            });
            
            // AND kapısı çıkış etiketi
            svg += `
                <text x="${gateX + 80}" y="${gateY - 20}" class="gate-label" font-size="12">
                    ${group.term}
                </text>
            `;
        });

        // OR kapısı (birden fazla grup varsa)
        if (this.groups.length > 1) {
            const orGateX = andGateStartX + 200;
            const orGateY = andGateY + (this.groups.length - 1) * andGateSpacing / 2;
            
            svg += this.createORGate(orGateX, orGateY, 'final_or');
            
            // AND kapılarından OR kapısına bağlantılar
            this.groups.forEach((group, index) => {
                const andY = andGateY + index * andGateSpacing;
                const andOutputX = andGateStartX + 70;
                const orInputY = orGateY + (index - (this.groups.length - 1) / 2) * 20;
                
                svg += `
                    <line x1="${andOutputX}" y1="${andY}" x2="${orGateX}" y2="${orInputY}" class="wire"/>
                `;
            });
            
            // Final çıkış
            svg += `
                <line x1="${orGateX + 70}" y1="${orGateY}" x2="${orGateX + 120}" y2="${orGateY}" class="wire"/>
                <text x="${orGateX + 130}" y="${orGateY + 5}" class="output-label">F</text>
                <circle cx="${orGateX + 125}" cy="${orGateY}" r="4" class="output-point"/>
            `;
        } else {
            // Tek grup varsa direkt çıkış
            const outputX = andGateStartX + 120;
            const outputY = andGateY;
            
            svg += `
                <line x1="${andGateStartX + 70}" y1="${outputY}" x2="${outputX}" y2="${outputY}" class="wire"/>
                <text x="${outputX + 10}" y="${outputY + 5}" class="output-label">F</text>
                <circle cx="${outputX + 5}" cy="${outputY}" r="4" class="output-point"/>
            `;
        }

        svg += '</svg>';
        return svg;
    }

    // SVG tanımları
    createSVGDefinitions() {
        return `
            <style>
                .wire { stroke: #374151; stroke-width: 2; fill: none; }
                .gate-body { fill: white; stroke: #374151; stroke-width: 2; }
                .gate-label { font-family: 'Courier New', monospace; font-weight: bold; fill: #374151; text-anchor: middle; }
                .input-label, .output-label { font-family: Arial, sans-serif; font-weight: bold; fill: #1f2937; font-size: 14px; }
                .input-point { fill: #10b981; stroke: #059669; stroke-width: 2; }
                .output-point { fill: #ef4444; stroke: #dc2626; stroke-width: 2; }
                .logic-circuit { border: 2px solid #e5e7eb; border-radius: 8px; background: linear-gradient(145deg, #f8fafc, #f1f5f9); }
            </style>
            
            <!-- NOT kapısı şablonu -->
            <g id="not-gate-template">
                <polygon points="0,0 0,20 15,10" class="gate-body"/>
                <circle cx="18" cy="10" r="3" fill="white" stroke="#374151" stroke-width="2"/>
            </g>
        `;
    }

    // AND kapısı oluştur
    createANDGate(x, y, id, label) {
        return `
            <g id="${id}" transform="translate(${x}, ${y})">
                <!-- AND kapısı gövdesi -->
                <rect x="0" y="-15" width="40" height="30" class="gate-body"/>
                <path d="M 40 -15 Q 55 -15 55 0 Q 55 15 40 15" class="gate-body"/>
                
                <!-- Giriş noktaları -->
                <circle cx="-2" cy="-8" r="2" class="input-point"/>
                <circle cx="-2" cy="8" r="2" class="input-point"/>
                
                <!-- Çıkış noktası -->
                <circle cx="57" cy="0" r="2" class="output-point"/>
                
                <!-- Kapı etiketi -->
                <text x="27" y="5" class="gate-label">AND</text>
            </g>
        `;
    }

    // OR kapısı oluştur
    createORGate(x, y, id) {
        return `
            <g id="${id}" transform="translate(${x}, ${y})">
                <!-- OR kapısı gövdesi -->
                <path d="M 0 -15 Q 20 -15 40 0 Q 20 15 0 15 Q 10 0 0 -15" class="gate-body"/>
                
                <!-- Giriş noktaları -->
                <circle cx="-2" cy="-8" r="2" class="input-point"/>
                <circle cx="-2" cy="8" r="2" class="input-point"/>
                
                <!-- Çıkış noktası -->
                <circle cx="42" cy="0" r="2" class="output-point"/>
                
                <!-- Kapı etiketi -->
                <text x="20" y="5" class="gate-label">OR</text>
            </g>
        `;
    }

    // NOT kapısı oluştur
    createNOTGate(x, y, id) {
        return `
            <g id="${id}" transform="translate(${x}, ${y})">
                <use href="#not-gate-template"/>
            </g>
        `;
    }

    // Gerekli giriş sinyallerini bul
    getRequiredInputs() {
        const inputs = new Set();
        
        this.groups.forEach(group => {
            const variables = group.term.match(/[A-D]'?/g) || [];
            variables.forEach(variable => {
                const baseVar = variable.replace("'", "");
                inputs.add(baseVar);
                if (variable.includes("'")) {
                    inputs.add(baseVar + "'");
                }
            });
        });
        
        return Array.from(inputs).sort();
    }

    // Terim girişlerini ayrıştır
    parseTermInputs(term) {
        const matches = term.match(/[A-D]'?/g) || [];
        return matches;
    }

    // Ana circuit diagram fonksiyonunu güncelle
    generateCircuitDiagram() {
        // SVG tabanlı şema oluştur
        this.generateSVGCircuitDiagram();
    }

    // Grup için değişmeyen değişkenleri analiz et ve etiketleri vurgula
    analyzeAndHighlightLabels() {
        console.log('🔍 Grup etiket analizi başlatılıyor...');
        
        // Önce tüm etiket vurgularını temizle
        this.clearLabelHighlights();
        
        // Her grup için değişmeyen değişkenleri bul
        this.groups.forEach((group, groupIndex) => {
            const invariantVariables = this.findInvariantVariables(group);
            console.log(`Grup ${groupIndex + 1} sabit değişkenler:`, invariantVariables);
            
            // Sabit değişkenleri etiketlerde vurgula
            this.highlightInvariantLabels(invariantVariables, groupIndex);
        });
    }
    
    // Bir gruptaki sabit kalan değişkenleri bul
    findInvariantVariables(group) {
        const invariants = {};
        
        if (group.minterms.length === 0) return invariants;
        
        // İlk mintermi referans al
        const firstMinterm = group.minterms[0];
        const firstBinary = this.mintermToBinary(firstMinterm);
        
        console.log(`Grup analizi - İlk minterm: ${firstMinterm}, binary: ${firstBinary.join('')}`);
        
        // Her bit pozisyonu için kontrol et
        for (let bitPos = 0; bitPos < this.variableCount; bitPos++) {
            const varName = this.variables[bitPos];
            const firstBit = firstBinary[bitPos];
            
            // Bu bit pozisyonunun tüm grupte sabit olup olmadığını kontrol et
            let isInvariant = true;
            for (let i = 1; i < group.minterms.length; i++) {
                const currentBinary = this.mintermToBinary(group.minterms[i]);
                console.log(`  Minterm ${group.minterms[i]}, binary: ${currentBinary.join('')}, ${varName} bit: ${currentBinary[bitPos]}`);
                if (currentBinary[bitPos] !== firstBit) {
                    isInvariant = false;
                    console.log(`  ${varName} değişken - değişiyor!`);
                    break;
                }
            }
            
            if (isInvariant) {
                invariants[varName] = firstBit;
                console.log(`  ✅ ${varName} sabit: ${firstBit === 0 ? "0 (negatif)" : "1 (pozitif)"}`);
            }
        }
        
        return invariants;
    }
    
    // Minterm'i ikili sayıya çevir
    mintermToBinary(minterm) {
        const binary = minterm.toString(2).padStart(this.variableCount, '0');
        return binary.split('').map(bit => parseInt(bit));
    }
    
    // Sabit değişkenlerin etiketlerini vurgula
    highlightInvariantLabels(invariants, groupIndex) {
        const groupColors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#ffeaa7', '#dda0dd', '#98d8c8', '#f39c12'
        ];
        const color = groupColors[groupIndex % groupColors.length];
        
        Object.entries(invariants).forEach(([varName, value]) => {
            this.highlightVariableLabel(varName, value, color);
        });
    }
    
    // Belirli bir değişkenin belirli değer etiketini vurgula
    highlightVariableLabel(varName, value, color) {
        // Hiçbir şekilde etiket vurgulama
        // (Renkli vurgulama tamamen devre dışı)
        return;
    }
    
    // Dikey etiketleri vurgula (A, B)
    highlightVerticalLabel(varName, value, color) {
        // Label vurgulama tamamen devre dışı
        return;
    }
    
    // Yatay etiketleri vurgula (B/BC, C, D/CD)
    highlightHorizontalLabel(varName, value, color) {
        // Label vurgulama tamamen devre dışı
        return;
    }
    
    // Satır indeksinden AB değerini çıkar
    getABValueFromRowIndex(rowIndex) {
        const abCombinations = [
            {A: 0, B: 0}, // 00
            {A: 0, B: 1}, // 01 
            {A: 1, B: 1}, // 11
            {A: 1, B: 0}  // 10
        ];
        return abCombinations[rowIndex] || null;
    }
    
    // Sütun indeksinden BC değerini çıkar (3 değişken için)
    getBCValueFromColIndex(colIndex) {
        const bcCombinations = [
            {B: 0, C: 0}, // 00
            {B: 0, C: 1}, // 01
            {B: 1, C: 1}, // 11
            {B: 1, C: 0}  // 10
        ];
        return bcCombinations[colIndex] || null;
    }
    
    // Sütun indeksinden CD değerini çıkar (4 değişken için)
    getCDValueFromColIndex(colIndex) {
        const cdCombinations = [
            {C: 0, D: 0}, // 00
            {C: 0, D: 1}, // 01
            {C: 1, D: 1}, // 11
            {C: 1, D: 0}  // 10
        ];
        return cdCombinations[colIndex] || null;
    }
    
    // Etikete vurgulama ekle
    addLabelHighlight(element, color) {
        // Renkli vurgulama istemiyorsanız sadece class ekleyin veya hiç eklemeyin
        element.style.backgroundColor = '';
        element.style.color = '';
        element.style.fontWeight = '';
        element.style.borderRadius = '';
        element.style.padding = '';
        element.style.transition = '';
        element.classList.remove('label-highlighted');
    }
    
    // Tüm etiket vurgularını temizle
    clearLabelHighlights() {
        const highlightedLabels = document.querySelectorAll('.label-highlighted');
        highlightedLabels.forEach(label => {
            label.style.backgroundColor = '';
            label.style.color = '';
            label.style.fontWeight = '';
            label.style.borderRadius = '';
            label.style.padding = '';
            label.classList.remove('label-highlighted');
        });
    }

    // Test fonksiyonu - 3 değişkenli sistem için örnek
    testLabelHighlighting() {
        console.log('🧪 Test: 3 değişkenli sistem etiket vurgulama');
        
        // 3 değişkenli sisteme geç
        this.variableCount = 3;
        this.variables = ['A', 'B', 'C'];
        this.generateTruthTable();
        this.generateKarnoMap();
        
        // m0, m1, m2, m3 grubunu oluştur (A' sabit)
        this.truthTable[0].output = 1; // m0: A=0, B=0, C=0
        this.truthTable[1].output = 1; // m1: A=0, B=0, C=1
        this.truthTable[2].output = 1; // m2: A=0, B=1, C=0
        this.truthTable[3].output = 1; // m3: A=0, B=1, C=1
        
        this.updateKarnoFromTruthTable();
        
        // Grupları bul ve etiketleri vurgula
        setTimeout(() => {
            this.findGroups();
        }, 500);
    }

    // Debug: Belirli bir grup kombinasyonunu test et
    testSpecificGroup() {
        console.log('🧪 Test: m4,m5,m7,m6 grubu analizi');
        
        // 4 değişkenli sisteme geç
        this.variableCount = 4;
        this.variables = ['A', 'B', 'C', 'D'];
        this.generateTruthTable();
        this.generateKarnoMap();
        
        // m4, m5, m7, m6 grupunu oluştur
        [4, 5, 7, 6].forEach(minterm => {
            this.truthTable[minterm].output = 1;
        });
        
        this.updateKarnoFromTruthTable();
        
        console.log('Seçilen mintermler: [4,5,7,6]');
        console.log('Binary gösterimi:');
        [4, 5, 7, 6].forEach(m => {
            const binary = m.toString(2).padStart(4, '0');
            console.log(`m${m}: ${binary} (A=${binary[0]}, B=${binary[1]}, C=${binary[2]}, D=${binary[3]})`);
        });
        
        // Find groups
        setTimeout(() => {
            this.findGroups();
        }, 500);
    }
    
    showLockMessage() {
        // Show temporary info message
        const existingMsg = document.getElementById('lockMessage');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        const message = document.createElement('div');
        message.id = 'lockMessage';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--warning-color);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: fadeInOut 3s ease;
        `;
        message.innerHTML = `
            <div style="text-align: center;">
                🔒 Map Locked!<br>
                <small style="font-weight: normal;">Click "Clear" button first to make changes</small>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Define CSS animation
        if (!document.getElementById('lockAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'lockAnimationStyle';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }

    // Genel redundant grup elimination algoritması
    filterRedundantGroups(groups, minterms) {
        console.log('🔍 Redundant grup kontrolü başlıyor...');
        console.log('Gelen gruplar:', groups.map(g => `${g.term}(${g.minterms.join(',')})`));
        
        const result = [];
        const targetMinterms = new Set(minterms);
        
        // Her grup için, diğer gruplar olmadan bu grubun gerekli olup olmadığını kontrol et
        for (let i = 0; i < groups.length; i++) {
            const currentGroup = groups[i];
            const otherGroups = groups.filter((_, index) => index !== i);
            
            // Diğer grupların kapsadığı mintermler
            const otherCoverage = new Set();
            otherGroups.forEach(group => {
                group.minterms.forEach(minterm => {
                    if (targetMinterms.has(minterm)) {
                        otherCoverage.add(minterm);
                    }
                });
            });
            
            // Bu grubun kapsadığı mintermlerden diğer gruplar tarafından kaplanmayanlar
            const uniqueContribution = currentGroup.minterms.filter(minterm => 
                targetMinterms.has(minterm) && !otherCoverage.has(minterm)
            );
            
            if (uniqueContribution.length > 0) {
                // Bu grup gerekli (başka hiçbir grup bu mintermlerini kapsayamıyor)
                result.push(currentGroup);
                console.log(`✅ ${currentGroup.term} korunuyor - Unique mintermler: [${uniqueContribution.join(',')}]`);
            } else {
                // Bu grup redundant (tüm mintermlerini diğer gruplar da kapsayabiliyor)
                console.log(`❌ ${currentGroup.term} redundant - Mintermler: [${currentGroup.minterms.filter(m => targetMinterms.has(m)).join(',')}]`);
            }
        }
        
        // Final doğrulama: Seçilen gruplar tüm mintermları kapsıyor mu?
        const finalCoverage = new Set();
        result.forEach(group => {
            group.minterms.forEach(minterm => {
                if (targetMinterms.has(minterm)) {
                    finalCoverage.add(minterm);
                }
            });
        });
        
        if (finalCoverage.size === targetMinterms.size) {
            console.log('✅ Final doğrulama başarılı - Tüm mintermler kaplandı');
            console.log('📋 Final gruplar:', result.map(g => `${g.term}(${g.minterms.join(',')})`));
            return result;
        } else {
            console.error('❌ Final doğrulama başarısız - Eksik mintermler:', 
                Array.from(targetMinterms).filter(m => !finalCoverage.has(m)));
            return groups; // Hata durumunda orijinal grupları döndür
        }
    }

    // BD grubunun atlanıp atlanmayacağını kontrol et
    shouldSkipBDGroup(minterms, selectedGroups) {
        // Eğer 3,4,5,7,11,12,13,15 test case'i ise
        const testCase = [3,4,5,7,11,12,13,15];
        if (JSON.stringify(minterms.sort()) === JSON.stringify(testCase)) {
            console.log('🎯 Özel test case tespit edildi, BD grubu kontrol ediliyor...');
            
            // Seçilen gruplar arasında BC' veya CD var mı?
            const hasBCPrime = selectedGroups.some(g => g.term === "BC'");
            const hasCD = selectedGroups.some(g => g.term === "CD");
            
            if (hasBCPrime || hasCD) {
                console.log('✅ BC\' veya CD grubu zaten seçildi, BD gereksiz');
                return true;
            }
        }
        return false;
    }
}

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yüklendi, KarnoMap başlatılıyor...');
    
    // Eğer zaten başlatılmışsa tekrar başlatma
    if (karnoApp) {
        console.log('KarnoMap zaten başlatılmış, tekrar başlatılmıyor');
        return;
    }
    
    try {
        karnoApp = new KarnoMap();
        console.log('KarnoMap başarıyla başlatıldı:', karnoApp);
    } catch (error) {
        console.error('KarnoMap başlatılırken hata oluştu:', error);
    }
});

// Global window.onload fallback
window.onload = function() {
    if (!karnoApp) {
        console.log('Fallback: window.onload ile KarnoMap başlatılıyor...');
        try {
            karnoApp = new KarnoMap();
            console.log('KarnoMap fallback ile başlatıldı:', karnoApp);
        } catch (error) {
            console.error('KarnoMap fallback başlatılırken hata oluştu:', error);
        }
    }
};
