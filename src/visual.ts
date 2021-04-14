/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";
import "@babel/polyfill";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";
export class Visual implements IVisual {
    private settings: VisualSettings;
    private target: HTMLElement;

    private dash: HTMLElement;
    private topic: HTMLElement;
    private subtopic: HTMLElement;
    private classification: HTMLElement;
   
    private mainContainer: HTMLElement;
    private topicContainer: HTMLElement;
    private classificationContainer: HTMLElement;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.initHtml();
        
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        this.updateTopic();
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return VisualSettings.parse(dataView) as VisualSettings;
    }


    private initHtml() {
        this.mainContainer = this.createChildElement('div', 'main-container', this.target);
        this.classificationContainer = this.createChildElement('div', 'classification-container', this.mainContainer);
        this.topicContainer = this.createChildElement('div', 'topic-container', this.mainContainer);
        this.classification = this.createChildElement('p', 'classification', this.classificationContainer);
        this.dash = this.createChildElement('span', 'dash', this.topicContainer);
        this.topic = this.createChildElement('p', 'topic', this.topicContainer);
        this.subtopic = this.createChildElement('p', 'subtopic', this.topicContainer);
    }

    private updateTopic() {
        this.topic.textContent = this.settings.topicSettings.topic;
        this.subtopic.textContent = this.settings.topicSettings.subtopic;

        this.topic.style.fontFamily = this.settings.topicSettings.fontTopicFamily;
        this.subtopic.style.fontFamily = this.settings.topicSettings.fontSubtopicFamily;

        this.topic.style.color = this.settings.topicSettings.topicColor;
        this.subtopic.style.color = this.settings.topicSettings.subtopicColor;
        this.subtopic.style.padding = this.settings.topicSettings.padding+'pt';
        this.topic.style.padding = this.settings.topicSettings.padding+'pt';
        
        this.classification.innerHTML = this.settings.topicSettings.classification === '<blank>' ? '' : this.settings.topicSettings.classification;

        const fontSize = this.settings.topicSettings.fontTopicSize + 'px';
        this.topic.style.fontSize = fontSize;
        this.dash.style.fontSize = fontSize
        this.classification.style.fontSize = fontSize;
        //this.subtopic.style.fontSize = this.settings.topicSettings.fontSize * 0.8 + 'px';
        this.subtopic.style.fontSize = this.settings.topicSettings.fontSubtopicSize + 'px';

        const dashHeight = this.dash.getBoundingClientRect().height;
        this.classification.style.paddingTop = dashHeight + 'px';

        const containerMargin = (dashHeight / 2) + 1;
        this.mainContainer.style.marginTop = `-${containerMargin}px`;
        
    }


    private createChildElement(tag: string, id: string, parent: HTMLElement): HTMLElement {
        const element = document.createElement(tag);
        element.id = id;
        parent.appendChild(element);
        return element;
    }
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}